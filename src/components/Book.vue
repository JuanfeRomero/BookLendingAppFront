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
                    item-text="firstName"
                    label="Author"
                    v-model="bookRegistration.authorId"
                />

                <v-btn v-if="editingId" color="success" @click="editBook">
                    Edit
                </v-btn>
                <v-btn v-else color="primary" @click="createBook">
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
                    <v-data-table dark
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
                                                            item-text="firstName"
                                                            label="Author"
                                                            v-model="editedItem.authorId"
                                                        />
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>
                                                                                           

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
                bookRegistration: {
                    bookname: "",
                    isbn: "",
                    authorId: "",
                },
                headers: [
                    { text: 'ID'},
                    { text: 'Title'},
                    { text: 'ISBN'},
                    { text: 'Actions'}
                ],
                authors: [],
                books: [],
                editingId: 0,
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
        methods: {
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
            this.books = data;
            },
            deleteBook: async function(bookId) {
            const data = await api.deleteBook(bookId);
            console.log(data);
            this.readBooks();
            },
            initiateEdit: async function (bookId) {
            this.editingId = bookId;
            console.log("Empezando a editar"+ this.editingId);
            const bookData = await api.readBook(this.editingId);
            this.bookRegistration.bookname = bookData.name;
            this.bookRegistration.isbn = bookData.isbn;
            this.bookRegistration.authorId = bookData.authorId;
            },
            editBook : async function () {
            console.log("Editing : "+this.editingId)
            const bookRequest = {
                id: this.editingId,
                name: this.bookRegistration.bookname,
                isbn: this.bookRegistration.isbn,
                authorId: this.bookRegistration.authorId,
            };
            const data = await api.updateBook(this.editingId, bookRequest);
            console.log(data);
            this.bookRegistration.bookname = "";
            this.bookRegistration.isbn = "";
            this.bookRegistration.authorId = "";
            this.editingId = 0;
            this.readBooks();
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