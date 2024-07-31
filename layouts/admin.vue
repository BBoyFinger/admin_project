<!-- @format -->

<template>
  <a-layout style="height: auto">
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
      <div class="logo">
        <img src="assets/images/logo1.png" alt="logo" width="50" height="50" />
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        style="margin-top: 5px"
      >
        <a-menu-item key="1">
          <DashboardOutlined />
          <span class="nav-text">
            <NuxtLink to="/dashboard"> Dashboard </NuxtLink>
          </span>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <user-outlined />
              <span>Tour</span>
            </span>
          </template>
          <a-menu-item key="2">
            <NuxtLink to="/tour/tourlist"> Tour List </NuxtLink>
          </a-menu-item>
          <a-menu-item key="3">
            <NuxtLink to="/tour/tranlist"> Import Transaction </NuxtLink>
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="sub3">
          <template #title>
            <span>
              <team-outlined />
              <span>Product</span>
            </span>
          </template>
          <a-menu-item key="5">
            <NuxtLink to="/category"> Category List </NuxtLink>
          </a-menu-item>
          <a-menu-item key="6">
            <NuxtLink to="/product"> Product List </NuxtLink>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub4">
          <template #title>
            <span>
              <team-outlined />
              <span>Com Rule</span>
            </span>
          </template>
          <a-menu-item key="8">
            <NuxtLink to="/comrule"> Com List </NuxtLink>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub5">
          <template #title>
            <span>
              <team-outlined />
              <span>User</span>
            </span>
          </template>
          <a-menu-item key="10">
            <NuxtLink to="/user"> User List </NuxtLink>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="{ background: '#fff', padding: 0 }">
        <a-flex justify="flex-end" align="center">
          <a-space size="middle" direction="horizontal" align="end">
            <a-badge count="5">
              <a-button
                shape="circle"
                :icon="h(NotificationOutlined)"
                @click="handleClickNotification"
              />
            </a-badge>
            <a-badge count="5">
              <a-button
                shape="circle"
                :icon="h(MessageOutlined)"
                @click="handleClickNotification"
              />
            </a-badge>

            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1">
                    <NuxtLink to="/profile">
                      <UserOutlined />
                      My Profile
                    </NuxtLink>
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="2">
                    <LogoutOutlined />
                    <NuxtLink to="#" @click="handleLogout"> Logout</NuxtLink>
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button shape="circle" :icon="h(UserOutlined)"> </a-button>
            </a-dropdown>
          </a-space>
        </a-flex>
      </a-layout-header>
      <a-layout-content :style="{ margin: '5px' }">
        <div
          :style="{ padding: '5px', background: '#fff', minHeight: '450px' }"
        >
          <slot> </slot>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Copyright ©2024 by ATI
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  AppstoreOutlined,
  SettingOutlined,
  MailOutlined,
  NotificationOutlined,
  MessageOutlined,
} from "@ant-design/icons-vue";
const client = useSupabaseClient();
const onCollapse = (collapsed: boolean, type: string) => {
  console.log(collapsed, type);
};

const onBreakpoint = (broken: boolean) => {
  console.log(broken);
};

const selectedKeys = ref<string[]>(["2"]);

const handleClickNotification = () => {
  console.log("click notification");
};

const handleLogout = async () => {
  console.log("logout");
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    await navigateTo("/login");
  } catch (error) {
    console.log(error);
  }
};
</script>
<style scoped>
body {
  margin: 0;
  padding: 0;
  background-color: #141414;
}
.ant-layout-sider-children .logo {
  height: 50px;
  padding: 5px 0px;
  text-align: center;
  /* background: rgba(255, 255, 255, 0.3); */
}

.site-layout-sub-header-background {
  background: #fff;
}

.site-layout-background {
  background: #fff;
}

/* .ant-layout-header {
    inherits: 0;
    height: 44px;
  }
  .ant-space-item {
    inherits: 0;
    height: 44px;
  } */

/* .ant-layout-sider-zero-width-trigger-left {
    top: 220px;
  } */
[data-theme="dark"] .site-layout-sub-header-background {
  background: #141414;
}

main {
  height: 85vh;
  overflow-y: scroll;
  background: transparent;
}

main::-webkit-scrollbar {
  width: 0;
}
</style>
