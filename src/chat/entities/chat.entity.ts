import { Entity, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class Chat {
  @PrimaryKey({ type: 'uuid' })
  id: string;
}
