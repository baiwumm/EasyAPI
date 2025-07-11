-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apis" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "path" VARCHAR(50) NOT NULL,
    "method" VARCHAR(10) NOT NULL DEFAULT 'GET',
    "example_url" TEXT,
    "request_params" JSONB,
    "response_format" JSONB,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" INTEGER NOT NULL,
    "call_count" INTEGER NOT NULL DEFAULT 0,
    "last_called" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "apis_path_key" ON "apis"("path");

-- AddForeignKey
ALTER TABLE "apis" ADD CONSTRAINT "apis_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
