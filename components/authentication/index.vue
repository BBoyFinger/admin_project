<!-- @format -->

<template>
  <a-row
    type="flex"
    justify="center"
    align="middle"
    class="auth-form-container"
  >
    <a-col :xs="24" :sm="16" :md="12" :lg="8" :xl="6">
      <div class="logo-form">
        <img src="/assets/images/logo.png" alt="logo" class="logo-img" />
        <h6 class="logo-title">Geishatei</h6>
      </div>
      <a-card>
        <template #title>
          <h1>{{ mode === "login" ? "Sign In" : "Register" }}</h1>
        </template>
        <a-form :model="formState" @finish="onFinish" v-bind="layout">
          <a-form-item
            v-if="mode === 'register'"
            label="Full Name"
            name="fullname"
            :rules="[{ required: true, message: 'Please input fullname!' }]"
          >
            <a-input
              v-model:value="formState.fullname"
              placeholder="Your fullname"
            >
              <template #prefix>
                <UserOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item
            label="Email"
            name="email"
            :rules="[
              {
                required: true,
                message: 'Please input your email!',
                type: 'email',
              },
            ]"
          >
            <a-input v-model:value="formState.email" placeholder="Your email">
              <template #prefix>
                <MailOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item
            label="Password"
            name="password"
            :rules="[
              { required: true, message: 'Please input your password!' },
            ]"
          >
            <a-input-password
              v-model:value="formState.password"
              placeholder="password"
            >
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item
            v-if="mode === 'register'"
            label="Confirm Password"
            name="confirmPassword"
            :rules="[
              { required: true, message: 'Please confirm your password!' },
            ]"
          >
            <a-input-password
              v-model:value="formState.confirmPassword"
              placeholder="confirm Password"
            >
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item v-if="error" :validateStatus="'error'">
            <a-alert :message="error" type="error" show-icon></a-alert>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              block
              :loading="loading"
              >{{ mode === "login" ? "Login" : "Register" }}</a-button
            >
          </a-form-item>
        </a-form>
        <p v-if="mode === 'login'">
          Don’t have an account yet?
          <NuxtLink
            to="/register"
            class="font-medium text-primary-600 hover:underline"
            >Sign up</NuxtLink
          >
        </p>
        <p v-else>
          Already have an account?
          <NuxtLink to="/login">Login here </NuxtLink>
        </p>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

import { useUserStore } from "@/stores/user/user";
const userStore = useUserStore();

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 80 },
};
const error = ref("");
const supabase = useSupabaseClient();

const props = defineProps({
  mode: {
    type: String,
    required: true,
    default: "login",
  },
});
const loading = ref(false);
const formState = reactive({
  fullname: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const router = useRouter();

const onFinish = async () => {
  if (props.mode === "login") {
    // Perform login
    console.log("Login", formState);
    try {
      loading.value = true;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formState.email,
        password: formState.password,
      });
      loading.value = false;
      if (error) throw error;
      console.log("data", data);
      await navigateTo("/dashboard");
    } catch (e) {
      loading.value = false;
      console.log(e);
    }
  } else {
    // Perform registration

    console.log("Register", formState);
    try {
      loading.value = true;
      if (formState.password !== formState.confirmPassword) {
        throw new Error("Password and Confirm Password must be the same");
      }
      const { data, error } = await supabase.auth.signUp({
        email: formState.email,
        password: formState.password,
      });
      if (error) throw error;

      console.log(data);
      const userItem = {
        fullname: formState.fullname,
        email: formState.email,
        phone: undefined,
        roleName: "guest",
        roleId: undefined,
      };
      await userStore.addUser(userItem);
      loading.value = false;
      await navigateTo("/dashboard");
    } catch (e) {
      loading.value = false;
      console.log(e);
      error.value = e.message;
    }
  }
};

const switchMode = () => {
  router.push({ path: props.mode === "login" ? "/register" : "/login" });
};
</script>

<style scoped>
.auth-form-container {
  min-height: 100vh;
}

.logo-form {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
}

.logo-title {
  font-size: 24px;
}

img {
  width: 64px;
  height: 64px;
  margin-right: 8px;
}
</style>
