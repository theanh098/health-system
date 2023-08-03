import { Injectable } from '@nestjs/common';
import { create } from 'hl7parser';
import { readFile } from 'fs/promises';
import { ORU_PID_DEFINETION } from './oru.r01.hl7';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async hl7_soap() {
    const rawMessage = await readFile('src/simple.txt', 'utf-8');
    const message = create(rawMessage.split('\n').join('\r'));

    const rs: Partial<Record<keyof typeof ORU_PID_DEFINETION, string>> = {};

    Object.keys(ORU_PID_DEFINETION).forEach((key) => {
      if (typeof ORU_PID_DEFINETION[key] === 'string')
        rs[key] = message.get(ORU_PID_DEFINETION[key]).toString();
      else {
        const rs_child: any = {};
        const nestedData = ORU_PID_DEFINETION[key]; // 2 level
        Object.keys(nestedData).forEach((k) => {
          rs_child[k] = message.get(nestedData[k]).toString();
        });

        rs[key] = rs_child;
      }
    });

    return rs;
  }
}
