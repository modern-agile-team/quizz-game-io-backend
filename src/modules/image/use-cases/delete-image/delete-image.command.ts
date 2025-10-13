import { ICommand } from '@nestjs/cqrs';

export interface IDeleteImageCommandProps {
  imageId: string;
}

export class DeleteImageCommand implements ICommand {
  readonly imageId: string;

  constructor(props: IDeleteImageCommandProps) {
    this.imageId = props.imageId;
  }
}
