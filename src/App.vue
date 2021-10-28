<template>
  <v-app>
    <v-app-bar app color="grey darken-4" flat>
      <v-container class="py-0 fill-height">
        <!-- Menu Buttons -->
        <v-btn to="/" text>Dashboard</v-btn>
        <v-btn to="/author" text>Author</v-btn>
        <v-btn to="/book" text>Book</v-btn>
        <v-btn to="/member" text>Member</v-btn>

        <v-spacer />

        <v-responsive max-width="260"/>
      </v-container>
    </v-app-bar>

<!-- Main content -->
    <v-main class="grey darken-3">
      <v-container>
        <v-row>
          <v-col>
            <v-sheet min-height="70vh" rounded="lg">
              <!-- -->
              <router-view/>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {

  },
  data: () => ({
    //
  }),
};
</script>
