//PART A
// i chose not to make setter or getter for password on purpose
export class User {
    notebooks;
    _id;
    name;
    email;
    password;
    phone;
    _age;
    constructor(id, name, email, password, phone, age, notebooks = []) {
        this.notebooks = notebooks;
        this._id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.validateAge(age);
        this._age = age;
    }
    addNoteBook(notebook) {
        this.notebooks.push(notebook);
    }
    getNoteBooks() {
        return [...this.notebooks];
    }
    get id() {
        return this._id;
    }
    get age() {
        return this._age;
    }
    setAge(age) {
        this.validateAge(age);
        this._age = age;
    }
    validateAge(age) {
        if (age < 18 || age > 60) {
            throw new Error("Age Must be within 18 to 60");
        }
    }
    displayInfo() {
        console.log(`UserId:${this._id}\n
			Name:${this.name}\n
			Email:${this.email}\n
			Phone:${this.phone}\n
			Age:${this.age}`);
    }
}
export class Admin extends User {
    constructor(id, name, email, password, phone, age) {
        super(id, name, email, password, phone, age);
    }
    manageNotes(action, noteTitle) {
        const msg = `Admin ${this.name}  performed "${action}" on note "${noteTitle}".`;
        console.log(msg);
        return msg;
    }
}
export class Note {
    id;
    title;
    content;
    userId;
    author;
    constructor(id, title, content, author) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.userId = author.id;
    }
    preview() {
        return this.content;
    }
}
export class NoteBook {
    id;
    title;
    notes = [];
    constructor(id, title) {
        this.id = id;
        this.title = title;
    }
    addNote(id, title, content, author) {
        const note = new Note(id, title, content, author);
        this.notes.push(note);
        return note;
    }
    removeNote(noteId) {
        this.notes = this.notes.filter((note) => note.id !== noteId);
    }
    getNotes() {
        return [...this.notes];
    }
}
export class Storage {
    items = [];
    addItem(item) {
        this.items.push(item);
    }
    removeItem(item) {
        this.items = this.items.filter((existingItem) => existingItem !== item);
    }
    getAllItems() {
        return [...this.items];
    }
}
//# sourceMappingURL=index.js.map