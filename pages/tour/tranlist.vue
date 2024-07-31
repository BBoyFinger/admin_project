<!-- @format -->

<template>
  <div>
    <input type="file" @change="handleFileChange" accept=".csv" />
    <!-- Hiển thị dữ liệu xem trước -->
    <template v-if="previewData.length > 0">
      <a-flex justify="space-between">
        <h3>Preview Data</h3>

        <a-button
          style="margin-bottom: 5px"
          @click="saveData"
          type="primary"
          danger
          >Import Transactions</a-button
        >
      </a-flex>
      <table>
        <thead>
          <tr>
            <th v-for="(header, index) in previewHeaders" :key="index">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in previewData" :key="rowIndex">
            <td v-for="(col, colIndex) in row" :key="colIndex">{{ col }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin",
});
import chardet from "chardet";
import { ref } from "vue";
import Papa from "papaparse";

import { useProductStore } from "~/stores/product/product";
const productStore = useProductStore();

import { useComruleStore } from "~/stores/comrule/comrule";
const comruleStore = useComruleStore();

import { useTourinfoStore } from "~/stores/tourinfo/tourinfo";
const tourinfoStore = useTourinfoStore();

// create onMounted hook
onMounted(async () => {
  console.log("mounted");
  await productStore.bindProductData();
  await comruleStore.bindComruleData();
  await tourinfoStore.bindTourinfoData();
});

const previewData = ref([]);
const previewHeaders = ref([]);
const selectedData = ref([]);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    readCSV(file);
  }
};

const readCSV = (file) => {
  // Đọc nội dung của file dưới dạng ArrayBuffer
  const reader = new FileReader();
  reader.onload = (event) => {
    const arrayBuffer = event.target.result;

    // Xác định mã hóa của file CSV tự động
    const detectedEncoding = chardet.detect(new Uint8Array(arrayBuffer));

    // Nếu mã hóa được xác định, sử dụng mã hóa đó khi đọc file CSV
    if (detectedEncoding) {
      Papa.parse(file, {
        header: true,
        encoding: detectedEncoding,
        complete: (results) => {
          const data = results.data;
          const headers = results.meta.fields;

          previewData.value = data;
          previewHeaders.value = headers;
        },
        error: (error) => {
          console.error("CSV parsing error:", error);
        },
      });
    } else {
      console.error("Failed to detect CSV encoding");
    }
  };
  reader.readAsArrayBuffer(file);
};
const getSmaregiCateOfProduct = (productCode) => {
  console.log("productCode", productCode);
  //   filter product in productStore.getListProduct with condition: product.code === productCode
  console.log("productStore.getListProduct", productStore.getProductList);
  let product = productStore.getProductList.filter(
    (item) => item.code === productCode
  );

  if (product.length > 0) {
    console.log("product-in-db", product);
    return product[0].groupId;
  }

  return -1;
};
const getComruleFromSmaregiCate = (smaregiCate) => {
  console.log("smaregiCate", smaregiCate);

  let comrule = comruleStore.getComruleList.filter(
    (item) => item.smaregiCateId === smaregiCate
  );

  if (comrule) {
    return comrule[0];
  }

  return -1;
};
const getTotalComForProduct = (cateId, productCode, productPrice, quantity) => {
  console.log("getTotalComForProduct", productCode, cateId);
  //   filter product in productStore.getListProduct with condition: product.code === productCode
  let product = productStore.getProductList.filter(
    (item) => item.code === productCode
  );
  if (product.length > 0) {
    let listComFixed = comruleStore.getComruleList.filter(
      (item) => item.comType === 2
    );
    // has fixed comrule
    if (listComFixed.length > 0) {
      //   get comrule from listComFixed with condition: comrule.targetId === product[0].id
      let comrule = listComFixed.filter(
        (item) => item.targetId === product[0].id
      );
      if (comrule.length > 0) {
        // get totalCom is comrule.rateValue
        return quantity * comrule[0].rateValue;
      } else {
        let comruleForCate = comruleStore.getComruleList.filter(
          (item) => item.smaregiCateId === cateId
        );
        if (comruleForCate.length > 0) {
          let rateTmp = comruleForCate[0].rateValue;
          let taxTmp = comruleForCate[0].taxRate;
          let productTaxPrice = Math.round(
            (quantity * productPrice) / (1 + taxTmp / 100)
          );
          console.log(
            "productTaxPrice",
            productTaxPrice,
            quantity,
            productPrice
          );
          let totalCom = (productTaxPrice * rateTmp) / 100;
          console.log("totalCom", totalCom, rateTmp);
          return Math.round(totalCom);
        } else {
          // get totalCom is: productTaxPrice * ruleCom
          return 0;
        }
      }
    } else {
      // no fixed comrule
      // get totalCom is: productTaxPrice * ruleCom
      let comruleForCate = comruleStore.getComruleList.filter(
        (item) => item.smaregiCateId === cateId
      );
      if (comruleForCate.length > 0) {
        let rateTmp = comruleForCate[0].rateValue;
        let taxTmp = comruleForCate[0].taxRate;
        let productTaxPrice = Math.round(
          (quantity * productPrice) / (1 + taxTmp / 100)
        );
        console.log("productTaxPrice", productTaxPrice, quantity, productPrice);
        let totalCom = (productTaxPrice * rateTmp) / 100;
        console.log("totalCom", totalCom, rateTmp);
        return Math.round(totalCom);
      } else {
        // get totalCom is: productTaxPrice * ruleCom
        return 0;
      }
    }
  }
  return 0;
};
const createTranForTourNew = (tran, tourCode) => {
  let dataTran = {
    id: "",
    tranId: tran.field_7,
    customerName: tran.field_2,
    customerPassport: tran.field_3,
    productCode: tran.field_10,
    productCate: undefined,
    quantity: parseInt(tran.field_9 ? tran.field_9 : 0),
    productName: tran.field_8,
    productPriceNonTax: parseInt(tran.field_11 ? tran.field_11 : 0),
    productPriceTax: undefined,
    comRate: undefined,
    taxRate: undefined,
    totalCom: undefined,
    tranDate: tran.field_5,
  };
  // 0. Tìm sanh mục sản phẩm thông qua tran.field_10
  let cateId = getSmaregiCateOfProduct(dataTran.productCode);
  if (cateId === -1) {
    console.log("cateId-am", cateId, tran);
    dataTran.comRate = undefined;
    dataTran.totalCom = undefined;
    dataTran.productPriceTax = undefined;
    dataTran.taxRate = undefined;
    dataTran.totalCom = undefined;
    return dataTran;
  } else {
    console.log("cateId-duong", cateId, tran);
    // 1. Tính com cho sản phẩm thuộc list comrule có comType = 2
    let listComFixed = comruleStore.getComruleList.filter(
      (item) => item.comType === 2
    );
    let productTmp = productStore.getProductList.filter(
      (item) => item.code === dataTran.productCode
    );
    if (productTmp.length > 0) {
      let comrule = listComFixed.filter(
        (item) => item.targetId === productTmp[0].id
      );
      if (comrule.length > 0) {
        dataTran.comRate = comrule[0].rateValue;
        dataTran.taxRate = comrule[0].taxRate;
        dataTran.productPriceTax = Math.round(
          dataTran.productPriceNonTax / (1 + comrule[0].taxRate / 100)
        );
        dataTran.totalCom = dataTran.quantity * dataTran.comRate;
        console.log(
          "totalcom-fixed",
          dataTran.totalCom,
          dataTran.comRate,
          dataTran.quantity,
          comrule[0]
        );
        return dataTran;
      } else {
        // không tồn tại comrule cho sản phẩm đó thì tính com cho sản phẩm đó dựa theo tỉ lệ com của danh mục sản phẩm
        let comruleForCate = comruleStore.getComruleList.filter(
          (item) => item.smaregiCateId === cateId && item.comType === 1
        );
        if (comruleForCate.length > 0) {
          console.log("comruleForCate", comruleForCate[0]);
          // tồn tại comrule cho danh mục sản phẩm
          dataTran.comRate = tourCode.toLowerCase().includes("ati")
            ? comruleForCate[0].atiRateValue
            : comruleForCate[0].rateValue;
          console.log(
            "comRate",
            dataTran.comRate,
            comruleForCate[0].atiRateValue,
            comruleForCate[0].rateValue
          );

          dataTran.taxRate = comruleForCate[0].taxRate;
          dataTran.productPriceTax = Math.round(
            dataTran.productPriceNonTax / (1 + dataTran.taxRate / 100)
          );
          dataTran.totalCom = Math.round(
            (dataTran.quantity *
              dataTran.productPriceNonTax *
              dataTran.comRate) /
              100
          );
          console.log(
            "dataTran.totalCom-cate-fixed",
            dataTran.totalCom,
            dataTran.productPriceNonTax,
            dataTran.comRate,
            dataTran.quantity,
            dataTran.taxRate
          );
          return dataTran;
        } else {
          // không tồn tại comrule cho danh mục sản phẩm
          dataTran.comRate = undefined;
          dataTran.totalCom = undefined;
          dataTran.productPriceTax = undefined;
          dataTran.taxRate = undefined;
          dataTran.totalCom = undefined;
          return dataTran;
        }
      }
    } else {
      // không tồn tại sản phẩm trong productStore
      dataTran.comRate = undefined;
      dataTran.totalCom = undefined;
      dataTran.productPriceTax = undefined;
      dataTran.taxRate = undefined;
      dataTran.totalCom = undefined;
      return dataTran;
    }
  }
};
const createTranForTour = (tran, cateId, tourCode) => {
  let dataTran = {
    id: "",
    tranId: tran.field_7,
    customerName: tran.field_2,
    customerPassport: tran.field_3,
    productCode: tran.field_10,
    productCate: cateId,
    quantity: parseInt(tran.field_9 ? tran.field_9 : 0),
    productName: tran.field_8,
    productPriceNonTax: parseInt(tran.field_11 ? tran.field_11 : 0),
    productPriceTax: undefined,
    comRate: undefined,
    taxRate: undefined,
    totalCom: undefined,
    tranDate: tran.field_5,
  };
  //   1. Tính com cho sản phẩm thuộc list comrule có comType = 2
  let listComFixed = comruleStore.getComruleList.filter(
    (item) => item.comType === 2
  );
  let productTmp = productStore.getProductList.filter(
    (item) => item.code === dataTran.productCode
  );

  //   Nếu có danh sách comrule có comType = 2
  if (listComFixed.length > 0) {
    if (productTmp.length > 0) {
      // Nếu tồn tại sản phẩm trong database thì tìm kiếm comrule cho sản phẩm đó
      let comrule = listComFixed.filter(
        (item) => item.targetId === productTmp[0].id
      );
      console.log("comrule-fixed", comrule);
      if (comrule.length > 0) {
        // Nếu tồn tại comrule cho sản phẩm đó thì tính com cho sản phẩm đó theo tỉ lệ đã fixed: comrule.rateValue
        dataTran.comRate = comrule[0].rateValue;
        dataTran.taxRate = comrule[0].taxRate;
        dataTran.productPriceTax = Math.round(
          dataTran.productPriceNonTax / (1 + comrule[0].taxRate / 100)
        );
        dataTran.totalCom = dataTran.quantity * dataTran.comRate;
        console.log(
          "dataTran.totalCom",
          dataTran.totalCom,
          dataTran.comRate,
          dataTran.quantity
        );
        return dataTran;
      } else {
        // không tồn tại comrule cho sản phẩm đó thì tính com cho sản phẩm đó dựa theo tỉ lệ com của danh mục sản phẩm
        let comruleForCate = comruleStore.getComruleList.filter(
          (item) => item.smaregiCateId === cateId
        );
        if (comruleForCate.length > 0) {
          // tồn tại comrule cho danh mục sản phẩm

          dataTran.comRate = tourCode.toLowerCase().includes("ati")
            ? comruleForCate[0].atiRateValue
            : comruleForCate[0].rateValue;
          dataTran.taxRate = comruleForCate[0].taxRate;
          dataTran.productPriceTax = Math.round(
            dataTran.productPriceNonTax / (1 + comruleForCate[0].taxRate / 100)
          );
          dataTran.totalCom = Math.round(
            (dataTran.quantity * dataTran.productPriceTax * dataTran.comRate) /
              100
          );
          console.log(
            "dataTran.totalCom-cate-fixed",
            dataTran.totalCom,
            dataTran.productPriceTax,
            dataTran.comRate,
            dataTran.quantity,
            dataTran.taxRate
          );

          return dataTran;
        } else {
          // không tồn tại comrule cho danh mục sản phẩm
          dataTran.comRate = undefined;
          dataTran.totalCom = undefined;
          dataTran.productPriceTax = undefined;
          dataTran.taxRate = undefined;
          dataTran.totalCom = undefined;
          return dataTran;
        }
      }
    } else {
      // không tồn tại sản phẩm trong productStore
      dataTran.comRate = undefined;
      dataTran.totalCom = undefined;
      dataTran.productPriceTax = undefined;
      dataTran.taxRate = undefined;
      dataTran.totalCom = undefined;
      return dataTran;
    }
  } else {
    // không có danh sách comrule có comType = 2
    if (productTmp.length > 0) {
      let comruleForCate = comruleStore.getComruleList.filter(
        (item) => item.smaregiCateId === cateId
      );
      if (comruleForCate.length > 0) {
        // tồn tại comrule cho danh mục sản phẩm

        dataTran.comRate = tourCode.toLowerCase().includes("ati")
          ? comruleForCate[0].atiRateValue
          : comruleForCate[0].rateValue;
        dataTran.taxRate = comruleForCate[0].taxRate;
        dataTran.productPriceTax = Math.round(
          dataTran.productPriceNonTax / (1 + comruleForCate[0].taxRate / 100)
        );
        dataTran.totalCom = Math.round(
          (dataTran.quantity * dataTran.productPriceTax * dataTran.comRate) /
            100
        );
        console.log(
          "dataTran.totalCom-cate-no-fixed",
          dataTran.totalCom,
          dataTran.productPriceTax,
          dataTran.comRate,
          dataTran.quantity,
          dataTran.taxRate
        );
        return dataTran;
      } else {
        // không tồn tại comrule cho danh mục sản phẩm
        dataTran.comRate = undefined;
        dataTran.totalCom = undefined;
        dataTran.productPriceTax = undefined;
        dataTran.taxRate = undefined;
        dataTran.totalCom = undefined;
        return dataTran;
      }
    } else {
      // không tồn tại sản phẩm trong productStore
      dataTran.comRate = undefined;
      dataTran.totalCom = undefined;
      dataTran.productPriceTax = undefined;
      dataTran.taxRate = undefined;
      dataTran.totalCom = undefined;
      return dataTran;
    }
  }
  //   2. Tính com cho sản phẩm không thuộc list comrule có comType = 2
};
const saveData = () => {
  let tourList = [];
  selectedData.value = previewData.value.map((row, rowIndex) => {
    const rowData = {};
    Object.keys(row).forEach((key, index) => {
      rowData[`field_${index + 1}`] = row[key];
    });
    return rowData;
  });

  //  filter all item with field_6 is 1 from selectedData
  let okList = selectedData.value.filter(
    (item) => parseInt(item.field_6) === 1 && item.field_8 !== "未登録商品"
  );
  console.log("okList", okList);

  //   COM is 8% and field_8 is "未登録商品"
  let mitorokuShohinList = selectedData.value.filter(
    (item) => parseInt(item.field_6) === 1 && item.field_8 === "未登録商品"
  );
  console.log("mitorokuShohinList", mitorokuShohinList);

  //   import transaction from okList to tourinfo.transactions with condition: okList[index].field_3 ===  tourinfo.transactions[hindex].passport
  for (let i = 0; i < tourinfoStore.getTourinfoList.length; i++) {
    let tourItem = tourinfoStore.getTourinfoList[i];
    let dataTour = {
      tourCode: tourItem.tourCode,
      transactions: [],
    };
    console.log(tourItem);
    let touristList = tourItem.tourists ? JSON.parse(tourItem.tourists) : [];
    for (let j = 0; j < touristList.length; j++) {
      let touristItem = touristList[j];
      console.log(touristItem);
      for (let k = 0; k < okList.length; k++) {
        if (okList[k].field_3 === touristItem.passport) {
          let dataTranItem = createTranForTourNew(okList[k], dataTour.tourCode);
          dataTour.transactions.push(dataTranItem);
        }
      }
      for (let h = 0; h < mitorokuShohinList.length; h++) {
        if (mitorokuShohinList[h].field_3 === touristItem.passport) {
          let dataTranItem = {
            id: "",
            tranId: mitorokuShohinList[h].field_7,
            customerName: mitorokuShohinList[h].field_2,
            customerPassport: mitorokuShohinList[h].field_3,
            productCode: mitorokuShohinList[h].field_10,
            productCate: undefined,
            quantity: parseInt(
              mitorokuShohinList[h].field_9 ? mitorokuShohinList[h].field_9 : 0
            ),
            productName: mitorokuShohinList[h].field_8,
            productPriceNonTax: parseInt(
              mitorokuShohinList[h].field_11
                ? mitorokuShohinList[h].field_11
                : 0
            ),
            productPriceTax: undefined,
            comRate: dataTour.tourCode.toLowerCase().includes("ati") ? 10 : 8,
            taxRate: 8,
            totalCom: undefined,
            tranDate: mitorokuShohinList[h].field_5,
          };
          dataTranItem.totalCom = Math.round(
            (dataTranItem.quantity *
              dataTranItem.productPriceNonTax *
              dataTranItem.comRate) /
              100
          );
          console.log(
            "totalcom-mitoroku",
            dataTranItem.totalCom,
            dataTranItem.productPriceNonTax,
            dataTranItem.comRate,
            dataTranItem.quantity
          );
          dataTour.transactions.push(dataTranItem);
        }
      }
    }
    tourList.push(dataTour);
  }

  console.log(tourList);
  //   get totalCom for tour : sum all totalCom of transaction in tour
  for (let i = 0; i < tourList.length; i++) {
    let totalCom = 0;
    for (let j = 0; j < tourList[i].transactions.length; j++) {
      totalCom += tourList[i].transactions[j].totalCom;
    }
    tourList[i].totalCom = totalCom;
  }
  console.log(tourList);

  console.log(okList);
  console.log(mitorokuShohinList);

  console.log(selectedData.value);
};
</script>
<style scoped>
table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

table td,
table th {
  border: 1px solid #ddd;
  padding: 8px;
}

table tr:nth-child(even) {
  background-color: #f2f2f2;
}

table tr:hover {
  background-color: #ddd;
}

table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #f0f0f0;
  color: black;
}
</style>
