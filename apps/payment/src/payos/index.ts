import PayOS = require('@payos/node');
import { configs } from '~/configs';

export const payOs = new PayOS(
    configs.payos.client as string,
    configs.payos.key as string,
    configs.payos.checksum as string,
);

export default payOs;
