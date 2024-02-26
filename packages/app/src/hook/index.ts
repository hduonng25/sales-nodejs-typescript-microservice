import { createHook, executionAsyncId } from 'async_hooks';

//Đoạn mã khởi tạo một Map có tên là store để lưu trữ các correlation ID được ánh xạ với các execution ID bất đồng bộ tương ứng.
const store: Map<number, string | undefined> = new Map();

//Hàm createHook được sử dụng để tạo một async hook. Hai sự kiện được định nghĩa:
//init: Khi một hoạt động bất đồng bộ được khởi tạo, nó sẽ kiểm tra xem có correlation ID nào đã được liên kết với hoạt động trước đó không và lưu trữ thông tin đó vào store.
//destroy: Khi một hoạt động bất đồng bộ kết thúc, nó sẽ xóa thông tin liên quan đến correlation ID khỏi store.
const hook = createHook({
    init: (asyncId, _, triggerAsyncId) => {
        const data = store.get(triggerAsyncId);
        if (store.has(triggerAsyncId)) {
            store.set(asyncId, data);
        }
    },
    destroy(asyncId) {
        if (store.has(asyncId)) {
            store.delete(asyncId);
        }
    },
});

//Cuối cùng, hook được kích hoạt để bắt đầu theo dõi các hoạt động bất đồng bộ trong ứng dụng Node.js.
hook.enable();

//Hai hàm này sử dụng executionAsyncId để lấy execution ID hiện tại và thực hiện việc đặt và lấy correlation ID từ store.
//setCorrelationId đặt correlation ID cho execution ID hiện tại, và getCorrelationId lấy correlation ID cho execution ID hiện tại.
export const setCorrelationId = (id: string): void => {
    const execId = executionAsyncId();
    store.set(execId, id);
};

export const getCorrelationId = (): string | undefined => {
    const execId = executionAsyncId();
    return store.get(execId);
};

// sử dụng module async_hooks trong Node.js để quản lý và truyền tải các correlation ID trong môi trường bất đồng bộ. Hãy giải thích từng phần
