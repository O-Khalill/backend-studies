//PART A
// i chose not to make setter or getter for password on purpose
export class User {
	protected _id: number;
	public name: string;
	protected email: string;
	private password: string;
	protected phone: string;
	private _age: number;

	constructor(
		id: number,
		name: string,
		email: string,
		password: string,
		phone: string,
		age: number,
		private notebooks: NoteBook[] = [],
	) {
		this._id = id;
		this.name = name;
		this.email = email;
		this.password = password;
		this.phone = phone;

		this.validateAge(age);
		this._age = age;
	}
	public addNoteBook(notebook: NoteBook): void {
		this.notebooks.push(notebook);
	}
	public getNoteBooks(): NoteBook[] {
		return [...this.notebooks];
	}
	public get id(): number {
		return this._id;
	}
	public get age(): number {
		return this._age;
	}
	public setAge(age: number): void {
		this.validateAge(age);
		this._age = age;
	}
	private validateAge(age: number): void {
		if (age < 18 || age > 60) {
			throw new Error("Age Must be within 18 to 60");
		}
	}
	public displayInfo() {
		console.log(
			`UserId:${this._id}\n
			Name:${this.name}\n
			Email:${this.email}\n
			Phone:${this.phone}\n
			Age:${this.age}`,
		);
	}
}

export class Admin extends User {
	constructor(
		id: number,
		name: string,
		email: string,
		password: string,
		phone: string,
		age: number,
	) {
		super(id, name, email, password, phone, age);
	}
	public manageNotes(action: string, noteTitle: string): string {
		const msg = `Admin ${this.name}  performed "${action}" on note "${noteTitle}".`;
		console.log(msg);
		return msg;
	}
}

export class Note {
	public id: number;
	public title: string;
	public content: string;
	public userId: number;
	public author: User;

	constructor(id: number, title: string, content: string, author: User) {
		this.id = id;
		this.title = title;
		this.content = content;

		this.author = author;
		this.userId = author.id;
	}

	public preview(): string {
		return this.content;
	}
}

export class NoteBook {
	public id: number;
	public title: string;
	private notes: Note[] = [];

	constructor(id: number, title: string) {
		this.id = id;
		this.title = title;
	}

	public addNote(
		id: number,
		title: string,
		content: string,
		author: User,
	): Note {
		const note = new Note(id, title, content, author);
		this.notes.push(note);
		return note;
	}

	public removeNote(noteId: number): void {
		this.notes = this.notes.filter((note) => note.id !== noteId);
	}

	public getNotes(): Note[] {
		return [...this.notes];
	}
}
export class Storage<T> {
	private items: T[] = [];

	public addItem(item: T): void {
		this.items.push(item);
	}

	public removeItem(item: T): void {
		this.items = this.items.filter((existingItem) => existingItem !== item);
	}

	public getAllItems(): T[] {
		return [...this.items];
	}
}
