import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Folder } from "./folder";
import { User } from "./user";

@Entity("notes")
export class Note {
  constructor(id?: string, title?: string, content?: string) {
    this.id = id;
    this.title = title;
    this.content = content;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => Folder, (folder) => folder.notes) folder: Folder;

  @ManyToOne(() => User, (user) => user.notes) owner: User;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
