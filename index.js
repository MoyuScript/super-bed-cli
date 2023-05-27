#!/usr/bin/env node
import dotenv from 'dotenv';
import got from 'got';
import crypto from 'crypto';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
    path: path.resolve(__dirname, '.env')
});
const token = process.env.SUPERBED_TOKEN;

if (!token) {
    throw new Error('No token provided');
}

const imagePaths = process.argv.slice(2);

if (!imagePaths.length) {
    throw new Error('No image paths provided');
}

const superbedGot = got.extend({
    headers: {
        Cookie: `token=${token}`
    }
});

const uploadConfig = await superbedGot('https://www.superbed.cn/?code=1').json();

const formDataObject = {
    nonce: 646703147,
    ts: uploadConfig.ts,
    token,
    sign: crypto.createHash('md5').update(`${token}_${uploadConfig.ts}_646703147`).digest('hex'),
    _xsrf: '',
    endpoints: 'superbed',
    categories: '',
};

for (const image of imagePaths) {
    formDataObject[`file${imagePaths.indexOf(image)}`] = {
        file: fs.createReadStream(image),
        path: image,
    };
}

const formData = new FormData();

Object.entries(formDataObject).forEach(([key, value]) => {
    if (typeof value !== 'object') {
        formData.append(key, value);
    } else {
        formData.append(key, value.file, path.basename(value.path));
    }
});

const uploadResult = await superbedGot.post(
    uploadConfig.url,
    {
        body: formData
    }
).json();

if (uploadResult.err !== 0) {
    throw new Error(uploadResult.msg);
}

const realImageResp = await superbedGot.get(
    'https://www.superbed.cn/',
    {
        searchParams: {
            ids: uploadResult.ids.join(',')
        }
    }
).json();

if (realImageResp.err !== 0) {
    throw new Error(realImageResp.msg);
}

const urls = Object.values(realImageResp.results).map((result) => result[2]);

const msg = `Upload Success:
${urls.join('\n')}`;

process.stdout.write(msg);
