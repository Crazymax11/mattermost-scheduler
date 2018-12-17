<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <v-list>
          <v-list-tile
            v-for="webhookName in webhooksNames"
            :key="webhookName">
            <v-list-tile-content>
              <v-list-tile-title v-text="webhookName"/>
              <v-list-tile-sub-title>{{ webhooks[webhookName].url }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-alert
          :value="error"
          color="error"
          transition="scale-transition"
        >
          {{ error }}
        </v-alert>
        <v-form
          ref="form"
          v-model="valid" >

          <v-text-field
            v-model="name"
            :rules="[v => !!v || 'name is required']"
            :disabled="loading"
            label="text"
            required
          />
          <v-text-field
            v-model="url"
            :rules="[v => !!v || 'webhook url is required']"
            :disabled="loading"
            label="webhook url"
            required
          />
          <v-btn
            :disabled="!valid"
            :loading="loading"
            color="success"
            @click="submit"
          >
            create
          </v-btn>
        </v-form>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import axios from 'axios';
import _ from 'lodash';

export default {
  data() {
    return {
      name: '',
      url: '',
      valid: false,
      loading: false,
      error: '',
      webhooks: {},
    };
  },
  ready() {
    axios.get('/api/v1/webhooks').then(({ data: webhooks }) => {
      this.webhooks = webhooks;
    });
  },
  computed: {
    webhooksNames() {
      return _.keys(this.webhooks);
    },
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        axios.post('/api/v1/webhooks', {
          name: this.name,
          url: this.url,
        }).catch((err) => { this.error = _.get(err, 'response.data', err.message); }).then(() => {
          this.loading = false;
          axios.get('/api/v1/webhooks').then(({ data: webhooks }) => {
            this.webhooks = webhooks;
          });
        });
      }
    },
  },
};
</script>
