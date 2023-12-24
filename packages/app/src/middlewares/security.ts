import cors from 'cors';
import helmet from 'helmet';
import { Middleware } from './common';

//TODO: cho phep ung dung co the goi api tu mot domain khac
//TODO: giup bao mat express
export default [cors(), helmet()] as Middleware[];
