-- CreateTable
CREATE TABLE "Comrule" (
    "id" SERIAL NOT NULL,
    "applyTo" INTEGER NOT NULL,
    "targetId" INTEGER,
    "targetName" TEXT,
    "comType" INTEGER,
    "rateValue" INTEGER,
    "validDate" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),

    CONSTRAINT "Comrule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "roleName" TEXT,
    "roleId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "name" TEXT,
    "parentId" INTEGER NOT NULL,
    "order" INTEGER,
    "tag" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "name" TEXT,
    "cateId" INTEGER,
    "thumbnail" TEXT,
    "taxType" INTEGER,
    "price" INTEGER,
    "memberPrice" INTEGER,
    "tag" TEXT,
    "createdDate" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Eventhistory" (
    "id" SERIAL NOT NULL,
    "eventName" TEXT,
    "apiName" TEXT,
    "doneByUser" INTEGER,
    "createdDate" TIMESTAMP(3),

    CONSTRAINT "Eventhistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tourinfo" (
    "id" SERIAL NOT NULL,
    "tourCode" TEXT,
    "arriveDate" TIMESTAMP(3),
    "returnDate" TIMESTAMP(3),
    "comTotal" INTEGER,
    "payStatus" INTEGER,
    "paidDate" TIMESTAMP(3),
    "tourLeadId" INTEGER,
    "tourLeadName" TEXT,
    "tourists" TEXT,
    "transactions" TEXT,

    CONSTRAINT "Tourinfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_cateId_fkey" FOREIGN KEY ("cateId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eventhistory" ADD CONSTRAINT "Eventhistory_doneByUser_fkey" FOREIGN KEY ("doneByUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tourinfo" ADD CONSTRAINT "Tourinfo_tourLeadId_fkey" FOREIGN KEY ("tourLeadId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
