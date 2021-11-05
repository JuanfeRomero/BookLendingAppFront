<v-simple-table>
    <template v-slot:default>
        <thead>
            <tr>
                <th class="text-left">
                    
                </th>
                <th class="text-left">
                    
                </th>
                <th class="text-left">
                    ISBN
                </th>
                <th class="text-left">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="book in books" :key="book.id">
                <td>{{ book.id }}</td>
                <td>{{ book.name }}</td>
                <td>{{ book.isbn }}</td>
                <td>
                    <v-btn icon color="pink" @click="deleteBook(book.id)">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn icon color="blue" @click="initiateEdit(book.id)">
                        <v-icon>mdi-pencil-box-outline</v-icon>
                    </v-btn>
                </td>
            </tr>
        </tbody>
    </template>
</v-simple-table>

