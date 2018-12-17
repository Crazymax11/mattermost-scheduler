<template>
  <v-app>
    <v-content>
      <v-container fluid>
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
            v-model="text"
            :rules="[v => !!v || 'text is required']"
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
          <v-text-field
            v-model="channel"
            :disabled="loading"
            label="channel"
          />
          <v-text-field
            v-model="username"
            :disabled="loading"
            label="username"
          />
          <v-text-field
            v-model="iconUrl"
            :disabled="loading"
            label="iconUrl"
          />
          <v-avatar
            :tile="true"
            :size="128"
          >
            <img
              :src="iconUrl || '/mattermost.png'"
              alt="avatar">
          </v-avatar>
          <v-btn
            :disabled="!valid"
            :loading="loading"
            color="success"
            @click="submit"
          >
            submit
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
      text: '',
      url: '',
      iconUrl: '',
      channel: '',
      username: '',
      valid: false,
      loading: false,
      error: '',
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        axios.post('/api/v1/messages', {
          text: this.text,
          iconUrl: this.iconUrl,
          username: this.username,
          url: this.url,
          channel: this.channel,
        }).catch((err) => { this.error = _.get(err, 'response.data', err.message); }).then(() => {
          this.loading = false;
        });
      }
    },
  },
};
</script>
