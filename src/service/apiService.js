import axios from 'axios';

const apiClient = {
    async readAuthors() {
        console.log("********************************READAUTHORSFIRST*****************************");
        const response = await axios.get("/authors");        
        console.log("********************************AFTER*****************************");
        return response.data;
    },
    async createAuthor(requestData) {
        const response = await axios.post("/author", requestData);
        return response.data;
    },
    async readMembers() {
        const response = await axios.get("/members");
        return response.data;
    },
    async createMember(requestData){
        const response = await axios.post("/member", requestData);
        return response.data;
    },
    async readBooks() {
        const response = await axios.get("/books");
        return response.data;
    },
    async createBook(requestData) {
        const response = await axios.post("/book", requestData);
        return response.data;
    },
    async deleteBook(bookId) {
        const response = await axios.delete(`/book/delete/${bookId}`);
        return response.data;
    },
    async lendBook(requestData){
        console.log("Request DATA");
        console.log(requestData);
        const response = await axios.post("/lend", requestData);
        return response.data;
    },
    async readBook(bookId){
        const response = await axios.get(`/book/${bookId}`);
        console.log(JSON.stringify(response.data, null, 3));
        return response.data;
    },
    async updateBook(bookId, requestData){
        const response = await axios.patch(`/book/update/${bookId}`, requestData);
        return response.data;
    }
};

export default apiClient;