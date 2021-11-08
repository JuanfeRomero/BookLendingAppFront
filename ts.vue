<template>
    <v-simple-table>
        <template v-slot:default>
            <thead>
                <tr>
                    <th class="text-left">
                        ID
                    </th>
                    <th class="text-left">
                        First Name
                    </th>
                    <th class="text-left">
                        Last Name
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="author in registeredAuthors" :key="author.id">
                    <td> {{ author.id }} </td>
                    <td> {{ author.firstName }} </td>
                    <td> {{ author.lastName }} </td>
                </tr>
            </tbody>
        </template>
    </v-simple-table>
</template>