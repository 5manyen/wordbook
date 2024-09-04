<template>
  <v-card class="mx-auto pa-8 pb-8" elevation="8" max-width="448" rounded="lg">
    <div class="text-subtitle-1 text-medium-emphasis">Account</div>

    <v-text-field
      density="compact"
      placeholder="Username"
      prepend-inner-icon="mdi-account"
      variant="outlined"
      v-model="userName"
      :rules="[userNameRules.required, userNameRules.checkLength, userNameRules.checkPattern]"
    ></v-text-field>

    <div class="text-subtitle-1 text-medium-emphasis">
      Password

      <!-- <a
        class="text-caption text-decoration-none text-blue"
        href="#"
        rel="noopener noreferrer"
        target="_blank"
      >
        Forgot login password?</a
      > -->
    </div>

    <v-text-field
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="visible ? 'text' : 'password'"
      density="compact"
      placeholder="Password"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      v-model="password"
      :rules="[passwordRules.required, passwordRules.checkLength, passwordRules.checkPattern]"
      @click:append-inner="visible = !visible"
    ></v-text-field>

    <v-card class="mb-12" color="pink-accent-1" variant="tonal" v-if="submitError">
      <v-card-text class="text-medium-emphasis text-caption">
        Error: {{ submitErrorMessage }}
      </v-card-text>
    </v-card>

    <v-btn
      class="mb-8"
      color="blue"
      size="large"
      variant="tonal"
      block
      :loading="loading"
      :disabled="validationError"
      @click="submit"
      >{{ submitButtonCaption }}</v-btn
    >

    <v-card-text class="text-center">
      <a class="text-blue text-decoration-none" @click="switchMode">
        {{ modeSwitchCaption }}<v-icon icon="mdi-chevron-right"></v-icon>
      </a>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';

import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const store = useUserStore();
const router = useRouter();

const userName = ref('');
const password = ref('');
const loginMode = ref(true);
const loading = ref(false);
const visible = ref(false);
const submitError = ref(false);
const submitErrorMessage = ref(null);
const validationError = ref(false);

const userNameRules = {
  required: (value) => {
    if (!!value) {
      validationError.value = false;
      return true;
    }
    validationError.value = true;
    return 'User name is required.';
  },
  checkLength: (value) => {
    if (value.length > 3) {
      validationError.value = false;
      return true;
    }
    validationError.value = true;
    return 'User name must be 4 characters or more.';
  },
  checkPattern: (value) => {
    if (/^\w+$/.test(value)) {
      validationError.value = false;
      return true;
    }
    validationError.value = true;
    return 'Alphabet, number and underscore can be used as user name.';
  }
};

const passwordRules = {
  required: (value) => {
    if (!!value) {
      validationError.value = false;
      return true;
    }
    validationError.value = true;
    return 'Password is required.';
  },
  checkLength: (value) => {
    if (value.length > 5) {
      validationError.value = false;
      return true;
    }
    validationError.value = true;
    return 'Password must be 6 characters or more.';
  },
  checkPattern: (value) => {
    if (/^\w+$/.test(value)) {
      validationError.value = false;
      return true;
    }
    validationError.value = true;
    return 'Alphabet, number and underscore can be used as user name.';
  }
};

const submitButtonCaption = computed(() => {
  return loginMode.value ? 'Log In' : 'Sign Up';
});

const modeSwitchCaption = computed(() => {
  return loginMode.value ? 'Sign up now' : 'Log in';
});

async function submit() {
  loading.value = true;
  submitError.value = false;
  if (loginMode.value) {
    const result = await store.login(userName.value, password.value);
    if (result) {
      router.replace('/');
      return;
    }
    submitErrorMessage.value = 'Authentication failed. Please check your input and try again.';
  } else {
    const result = await store.signUp(userName.value, password.value);
    if (result) {
      router.replace('/');
      return;
    }
    submitErrorMessage.value = 'Username already used. Please pick other name and try again.';
  }
  submitError.value = true;
  loading.value = false;
}

function switchMode() {
  loginMode.value = !loginMode.value;
}
</script>
