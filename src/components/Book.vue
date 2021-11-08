<template>
    <v-container>
        <h1>Book Management UI</h1>
        <p>Thus UI developed to handle Book Registration and Edits</p>
        <v-row>
            <v-col sm="12">
                <v-alert v-if="responseSuccess" dense text type="success">
                    You have successfully added book.
                </v-alert>
            </v-col>
            <v-col sm="6">
                <h3>Book Registration</h3>
                <v-text-field
                    v-model="bookRegistration.bookname"
                    label="Name"
                />
                <v-text-field
                    v-model="bookRegistration.isbn"
                    label="ISBN"
                />
                <v-autocomplete
                    :items="authors"
                    color="grey darken-3"
                    item-value="id"
                    :item-text="item => item.firstName + ' - ' + item.lastName"
                    label="Author"
                    v-model="bookRegistration.authorId"
                />
                <v-btn color="primary" @click="createBook">
                    Register
                </v-btn>
            </v-col>
            <v-col sm="6">
                <h3>Registered Books</h3>
                <v-card>
                    <v-card-title>
                        Registered Books
                        <v-spacer/>
                        <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            single-line
                            hide-details
                        />
                    </v-card-title>
                    <v-data-table 
                        dark
                        :headers="headers"
                        :items="books"
                        :search="search"
                        :items-per-page="7"
                        sort-by=""
                        class="elevation-1"
                    >
                            <template v-slot:top>
                            <v-toolbar flat>
                                <v-dialog v-model="dialog"
                                    max-width="500px"
                                >
                                    <v-card>
                                        <v-card-title>
                                            <span class="text-h5">Editar</span>
                                        </v-card-title>

                                        <v-card-text>
                                            <v-container>
                                                <v-row>
                                                    <v-col
                                                        cols="12"
                                                        sm="6"
                                                        md="4"
                                                    >
                                                        <v-text-field
                                                            v-model="editedItem.id"
                                                            label="ID"
                                                            disabled
                                                        />
                                                    </v-col>
                                                    <v-col
                                                        cols="12"
                                                        sm="6"
                                                        md="4"
                                                    >
                                                        <v-text-field
                                                            v-model="editedItem.name"
                                                            label="Title"
                                                        />
                                                    </v-col>
                                                    <v-col
                                                        cols="12"
                                                        sm="6"
                                                        md="4"
                                                    >
                                                        <v-text-field
                                                            v-model="editedItem.isbn"
                                                            label="ISBN"
                                                        />
                                                    </v-col>
                                                    <v-col
                                                        cols="12"
                                                        sm="6"
                                                        md="4"
                                                    >                                                        
                                                        <v-autocomplete
                                                            :items="authors"
                                                            color="grey darken-3"
                                                            item-value="id"
                                                            :item-text="item => item.firstName + ' - ' + item.lastName"
                                                            label="Author"
                                                            v-model="editedItem.authorId"
                                                        />
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer/>
                                            <v-btn
                                                color="red darken-1"
                                                text
                                                @click="close"
                                            >
                                                Cancelar
                                            </v-btn>
                                            <v-btn
                                                color="blue darken-1"
                                                text
                                                @click="editBook"
                                            >
                                                Guardar
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                                <v-dialog v-model="dialogDelete" max-width="500px">
                                    <v-card>
                                        <v-card-title class="text-h5">
                                            Esta seguro que desea borrar este item?
                                        </v-card-title>
                                        <v-card-actions>
                                            <v-spacer/>
                                            <v-btn color="red darken-1" text @click="closeDelete">Cancelar</v-btn>
                                            <v-btn color="blue darken-1" text @click="deleteBook">OK</v-btn>
                                            <v-spacer/>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-toolbar>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon
                                small
                                class="mr-2"
                                @click="initiateEdit(item)"
                            >
                                mdi-pencil
                            </v-icon>
                            <v-icon
                                small
                                @click="initiateDelete(item)"
                            >
                                mdi-delete
                            </v-icon>
                        </template>
                        <template v-slot:no-data>
                            <v-btn
                                color="primary"
                                @click="initialize"
                            >
                                Reset
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import api from "@/service/apiService";
import { uuid } from 'vue-uuid';

    export default {
        name: "Book",
        data() {
            return {
                search:'',
                dialog:false,
                dialogDelete:false,
                bookRegistration: {
                    bookname: "",
                    isbn: "",
                    authorId: "",
                },
                headers: [
                    { text: 'ID', value:'id'},
                    { text: 'Title', value:'name'},
                    { text: 'ISBN', value:'isbn'},
                    { text: 'Author', value:"author.fullName"},
                    { text: 'Actions', value:'actions', sortable:false},
                ],
                authors: [],
                books: [],
                editingId: -1,
                editingPosition: -1,
                editedItem: {
                    id:'',
                    name: '',
                    isbn: '',
                    authorId:''
                },
                defaultItem: {
                    id:'',
                    name:'',
                    isbn: '',
                    authorId: ''
                },
                responseSuccess: false,
            };
        },
        watch: {
            dialog(val){
                val || this.close();
            },
            dialogDelete(val){
                val || this.closeDelete();
            },
        },
        methods: {
            initialize(){
                this.readBooks();
            },
            createBook: async function() {
                const bookRequest = {
                    id: uuid.v1(),
                    name: this.bookRegistration.bookname,
                    isbn: this.bookRegistration.isbn,
                    authorId: this.bookRegistration.authorId,
                };
                const data = await api.createBook(bookRequest);
                console.log(data);
                this.bookRegistration.bookname = "";
                this.bookRegistration.isbn = "";
                this.bookRegistration.authorId = "";
                this.readBooks();
                this.responseSuccess = true;
            },
            readAuthors: async function() {
                const data = await api.readAuthors();
                this.authors = data;
            },
            readBooks: async function() {
                const data = await api.readBooks();
                await data.forEach(element => {
                    element.author = this.authors.filter(x => x.id === element.authorId);
                    element.author.fullName = `${element.author[0].firstName} ${element.author[0].lastName}`;
                });
                // console.log(data[0].author);
                this.books = data;
            },
            initiateDelete:async function(book){
                this.editingId = book.id;
                this.editingPosition = this.books.map(e => e.id).indexOf(this.editingId);
                this.editedItem = Object.assign({}, book);
                this.dialogDelete = true;
            },
            deleteBook: async function() {
                const data = await api.deleteBook(this.editingId);
                console.log(data);
                this.books.splice(this.editingPosition, 1);
                this.closeDelete();
            },
            closeDelete() {
                this.dialogDelete= false;
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editingId = -1;
                    this.editingPosition = -1;
                })
            },
            initiateEdit: async function (book) {
                this.editingId = book.id;
                this.editingPosition = this.books.map(e => e.id).indexOf(this.editingId);
                this.editedItem = Object.assign({}, book)
                console.log("Edited Item: ");
                console.log(this.editedItem);
                this.dialog = true;
            },
            editBook : async function () {
                console.log("Editing : "+this.editingId)
                const bookRequest = {
                    id: this.editingId,
                    name: this.editedItem.name,
                    isbn: this.editedItem.isbn,
                    authorId: this.editedItem.authorId,
                };
                console.log(bookRequest);
                const data = await api.updateBook(this.editingId, bookRequest);
                console.log(data);
                console.log("DATA DESPUES DE UPDATE");
                console.log(JSON.stringify(this.editedItem, null, 3));
                console.log(JSON.stringify(this.books[this.editingPosition], null, 3));
                Object.assign(this.books[this.editingPosition], this.editedItem);
                this.close();
            },
            close() {
                this.dialog = false;
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editingId = -1;
                    this.editingPosition = -1;
                })
            }
        },
        mounted(){
            this.readAuthors();
            this.readBooks();
        },
    };
</script>

<style>
</style>