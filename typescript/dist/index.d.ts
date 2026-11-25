export declare class User {
    private notebooks;
    protected _id: number;
    name: string;
    protected email: string;
    private password;
    protected phone: string;
    private _age;
    constructor(id: number, name: string, email: string, password: string, phone: string, age: number, notebooks?: NoteBook[]);
    addNoteBook(notebook: NoteBook): void;
    getNoteBooks(): NoteBook[];
    get id(): number;
    get age(): number;
    setAge(age: number): void;
    private validateAge;
    displayInfo(): void;
}
export declare class Admin extends User {
    constructor(id: number, name: string, email: string, password: string, phone: string, age: number);
    manageNotes(action: string, noteTitle: string): string;
}
export declare class Note {
    id: number;
    title: string;
    content: string;
    userId: number;
    author: User;
    constructor(id: number, title: string, content: string, author: User);
    preview(): string;
}
export declare class NoteBook {
    id: number;
    title: string;
    private notes;
    constructor(id: number, title: string);
    addNote(id: number, title: string, content: string, author: User): Note;
    removeNote(noteId: number): void;
    getNotes(): Note[];
}
export declare class Storage<T> {
    private items;
    addItem(item: T): void;
    removeItem(item: T): void;
    getAllItems(): T[];
}
//# sourceMappingURL=index.d.ts.map