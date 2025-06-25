-- CreateTable
CREATE TABLE "contacts" (
    "id" SERIAL NOT NULL,
    "firt_name" VARCHAR NOT NULL,
    "last_name" VARCHAR,
    "email" VARCHAR,
    "phone" VARCHAR,
    "username" VARCHAR NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
