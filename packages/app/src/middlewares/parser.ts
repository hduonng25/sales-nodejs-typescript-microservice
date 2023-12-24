import { json, urlencoded } from 'express';
import { Middleware } from './common';

//TODO: tach rieng body ra khoi controller, han che dung luong body de tranh overflow
export default [json({ limit: '50mb' }), urlencoded({ extended: true, limit: '10mb' })] as Middleware[];
