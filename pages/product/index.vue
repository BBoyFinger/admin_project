<template>
  <div>
    <CommonsBreadcrumbCard :listItem="listBreadcrumb" />
    <a-card size="small" title="List Product" style="width: 100%">
      <template #extra>
        <a style="font-size: 12px" @click="expand = !expand">
          <template v-if="expand">
            <UpOutlined />
          </template>
          <template v-else>
            <DownOutlined />
          </template>
          Collapse
        </a>
      </template>
      <a-form name="searchConditionForm">
        <a-col
          :xs="{ span: 24 }"
          :sm="{ span: 24 }"
          :md="{ span: 6 }"
          :xl="{ span: 6 }"
        >
          <a-form-item label="Smaregi Cate">
            <a-select
              width="100%"
              v-model:value="productStore.getSearchField.groupId"
              placeholder="please select category"
              :options="
                categoryStore.getCategoryList.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                })
              "
            >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col
          :xs="{ span: 24 }"
          :sm="{ span: 24 }"
          :md="{ span: 6 }"
          :xl="{ span: 6 }"
        >
          <a-form-item label="Category">
            <a-select
              width="100%"
              v-model:value="productStore.getSearchField.cateId"
              placeholder="please select category"
              :options="
                categoryStore.getCategoryList.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                })
              "
            >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col
          v-show="expand"
          :xs="{ span: 24 }"
          :sm="{ span: 24 }"
          :md="{ span: 6 }"
          :xl="{ span: 6 }"
        >
          <a-form-item label="Name">
            <a-input
              placeholder="Enter Name"
              v-model:value="productStore.getSearchField.name"
            />
          </a-form-item>
        </a-col>
        <a-col
          :xs="{ span: 24 }"
          :sm="{ span: 24 }"
          :md="{ span: 6 }"
          :xl="{ span: 6 }"
        >
          <a-form-item label="Code">
            <a-input
              placeholder="Enter Code"
              v-model:value="productStore.getSearchField.code"
            />
          </a-form-item>
        </a-col>

        <a-col
          :xs="{ span: 24 }"
          :sm="{ span: 24 }"
          :md="{ span: 6 }"
          :xl="{ span: 6 }"
          v-show="false"
        >
          <a-form-item label="Tax">
            <a-input
              placeholder="Enter Tax"
              type="text"
              v-model:value="productStore.getSearchField.taxType"
            />
          </a-form-item>
        </a-col>
        <a-row>
          <a-col :span="18">
            <a-space size="small">
              <a-button
                type="primary"
                :icon="h(SearchOutlined)"
                size="small"
                style="color: #ffffff; background-color: #13c2c2"
                @click="handleSearch"
                >Search
              </a-button>
              <a-button
                type="primary"
                :icon="h(ClearOutlined)"
                size="small"
                style="color: #595959; background-color: #f5f5f5"
                @click="handleReset"
                >Cancel
              </a-button>
              <a-button
                type="primary"
                danger
                :icon="h(ImportOutlined)"
                size="small"
                @click="handleImportProductFromSmaregi"
                >Import
              </a-button>
            </a-space>
          </a-col>
          <a-col :span="6" style="text-align: right">
            <a-button
              type="primary"
              :icon="h(FileAddOutlined)"
              size="small"
              style="color: #ffffff; background-color: #fa8c16"
            >
              <NuxtLink to="/product/addproduct"> Create </NuxtLink>
            </a-button>
          </a-col>
        </a-row>
      </a-form>
      <a-space direction="horizontal" style="width: 100%" v-show="hasSelected">
        <a-popconfirm
          title="Are you sure delete all seleted item?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="handleConfirmDeleteAll"
          @cancel="handleCancelDeleteAll"
        >
          <a-button
            type="primary"
            :icon="h(DeleteOutlined)"
            style="background-color: #ffccc7; color: #595959"
            size="small"
            @click="handleDeleteAll"
            >Delete All</a-button
          >
        </a-popconfirm>
        <span style="color: brown">{{
          `Selected ${state.selectedRowKeys.length} items`
        }}</span>
      </a-space>

      <a-table
        rowKey="id"
        :row-selection="{
          selectedRowKeys: state.selectedRowKeys,
          onChange: onSelectChange,
        }"
        :columns="columns"
        :data-source="productStore.getProductList"
        :scroll="{ x: 1500, y: 550 }"
        :pagination="{
          total: productStore.getProductList.length,
          pageSize: 50,
        }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1">
                    <EditOutlined />
                    <NuxtLink
                      :to="{
                        path: '/product/addproduct',
                        query: { id: record.id },
                      }"
                    >
                      Edit
                    </NuxtLink>
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="2" @click="handleDelete(record)">
                    <DeleteOutlined />
                    Delete
                  </a-menu-item>
                  <a-menu-divider />
                </a-menu>
              </template>
              <a-button shape="circle" :icon="h(MoreOutlined)"> </a-button>
            </a-dropdown>
          </template>
        </template>
      </a-table>
      <CommonsModalConfirm
        :showModal="productStore.getOpenDelete"
        title="Delete Product"
        @confirmOK="handleConfirmDelete"
        @confirmCancel="handleCancelDelete"
      >
        <p style="color: red">Are you sure delete this product?</p>
      </CommonsModalConfirm>
      <ProductImportCSVCard
        :showModal="openImportModal"
        :modalWidth="1280"
        @confirmOK="handleConfirmImportProduct"
        @confirmCancel="handleConfirmCancelImportProduct"
      />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "admin",
});
import {
  SearchOutlined,
  FileAddOutlined,
  ClearOutlined,
  DeleteOutlined,
  MoreOutlined,
  EditOutlined,
  FilePdfOutlined,
  ImportOutlined,
} from "@ant-design/icons-vue";
import { computed, h, reactive, ref } from "vue";
import { useProductStore } from "~/stores/product/product";
const productStore = useProductStore();

import { useCategoryStore } from "~/stores/category/category";
const categoryStore = useCategoryStore();
categoryStore.bindCategoryData();

const expand = ref(false);
const listBreadcrumb = ref([{ id: 1, text: "Product List", path: "" }]);
const modalEditCategoryVisible = ref(false);
const selectedProduct = ref(undefined);
const openImportModal = ref(false);

const columns = ref([
  { title: "ID", width: 60, dataIndex: "id", key: "id" },
  { title: "Name", width: 250, dataIndex: "name", key: "name" },
  { title: "Code", width: 120, dataIndex: "code", key: "code" },
  { title: "Category", width: 120, dataIndex: "cateId", key: "cateId" },
  { title: "Smaregi Cate", width: 120, dataIndex: "groupId", key: "groupId" },
  { title: "Thumbnail", width: 120, dataIndex: "thumbnail", key: "thumbnail" },
  {
    title: "Tax Type",
    width: 120,
    dataIndex: "taxType",
    key: "taxType",
    customRender: ({ record }) => {
      return h(
        "span",
        {},
        record.taxType ? productStore.getTaxTypeName(record.taxType) : undefined
      );
    },
  },
  { title: "Price", width: 120, dataIndex: "price", key: "price" },
  {
    title: "Member Price",
    width: 120,
    dataIndex: "memberPrice",
    key: "memberPrice",
  },
  { title: "Tag", width: 120, dataIndex: "tag", key: "tag" },
  {
    title: "CreatedDate",
    width: 120,
    dataIndex: "createdDate",
    key: "createdDate",
  },
  {
    title: "Actions",
    key: "operation",
    align: "center",
    width: 100,
  },
]);

type Key = string | number;
const state = reactive<{
  selectedRowKeys: Key[];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});
const hasSelected = computed(() => state.selectedRowKeys.length > 0);

const onSelectChange = (selectedRowKeys: Key[]) => {
  console.log("selectedRowKeys changed: ", selectedRowKeys);
  state.selectedRowKeys = selectedRowKeys;
};

const handleSearch = async () => {
  console.log("search");
  await bindData();
};
const handleReset = () => {
  console.log("reset");
  productStore.clearSearchField();
};
const handleCreate = () => {
  console.log("create");
  productStore.clearItem();
  selectedProduct.value = undefined;
};

const handleDeleteAll = () => {
  console.log("delete all");
};
const handleConfirmDeleteAll = () => {
  console.log("confirm delete all");
  message.success("Delete all successfully");
};

// get product from db
const bindData = async () => {
  console.log("bind data product");
  await productStore.bindProductData();
};

const handleCancelDeleteAll = () => {
  console.log("cancel delete all");
};

const handleDelete = (key: any) => {
  console.log("delete item", key);
  // openDeleteConfirmModal.value = true;
  productStore.deleteItem(key);
};
const handleConfirmDelete = async () => {
  console.log("confirm delete");
  try {
    await productStore.deleteProduct();
    message.success("Delete product successfully");
    // openDeleteConfirmModal.value = false;
    productStore.closeDelete();
  } catch (error) {
    message.error("Delete product failed");
  }
};
const handleCancelDelete = () => {
  console.log("cancel delete");
  productStore.closeDelete();
  // openDeleteConfirmModal.value = false;
};
const handleImportProductFromSmaregi = () => {
  console.log("import product from smaregi");
  openImportModal.value = true;
};
const handleConfirmImportProduct = async (dataProduct: any) => {
  console.log("confirm import product", dataProduct);
  openImportModal.value = false;
  try {
    if (dataProduct) {
      for (let i = 0; i < dataProduct.length; i++) {
        let dataItem = {
          name: dataProduct[i].field_4
            ? dataProduct[i].field_4.trim()
            : undefined,
          code: dataProduct[i].field_3
            ? dataProduct[i].field_3.trim()
            : undefined,
          tag: undefined,
          cateId: undefined,
          taxType: 2,
          price: dataProduct[i].field_5
            ? parseInt(dataProduct[i].field_5)
            : undefined,
          memberPrice: undefined,
          thumbnail: undefined,
          groupId: dataProduct[i].field_2
            ? parseInt(dataProduct[i].field_2)
            : undefined,
        };
        await productStore.addProduct(dataItem);
      }
      bindData();
      message.success("Import data successfully");
    }
  } catch (error) {
    console.log("error", error);
  }
};
const handleConfirmCancelImportProduct = () => {
  console.log("cancel import product");
  openImportModal.value = false;
};
// create onMounted hook
onMounted(() => {
  bindData();
});
</script>
