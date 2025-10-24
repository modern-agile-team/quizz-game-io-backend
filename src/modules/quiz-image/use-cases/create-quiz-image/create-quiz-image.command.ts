import { ICommand } from '@nestjs/cqrs';

export interface ICreateQuizImageCommandProps {
  category: string;
  name?: string;
  buffer: Buffer;
  originalFileName: string;
  extension: string;
  contentLength: string;
  width: number;
  height: number;
}

export class CreateQuizImageCommand implements ICommand {
  readonly category: string;
  readonly name?: string;
  readonly buffer: Buffer;
  readonly originalFileName: string;
  readonly extension: string;
  readonly contentLength: string;
  readonly width: number;
  readonly height: number;

  constructor(props: ICreateQuizImageCommandProps) {
    this.name = props.name;
    this.category = props.category;
    this.buffer = props.buffer;
    this.originalFileName = props.originalFileName;
    this.extension = props.extension;
    this.contentLength = props.contentLength;
    this.width = props.width;
    this.height = props.height;
  }
}
