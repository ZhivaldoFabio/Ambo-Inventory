<template>
    <form action="/action_page.php">
        <div class="sm:col-span-4">
            <label
              for="namasupplier"
              class="block text-sm font-medium leading-6 text-text-700"
              >Nama Produk</label
            >
            <div class="mt-2">
              <div
                class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
              >
                <input
                  type="text"
                  name="namaproduk"
                  id="namaproduk"
                  v-model="newProdukname"
                  class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Nama Produk"
                />
              </div>
            </div>
        </div>
        <div class="sm:col-span-4">
            <label
              for="supplier"
              class="block text-sm font-medium leading-6 text-text-700"
              >Supplier</label
            >
            <div class="mt-2">
              <div
                class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
              >
                <input
                  type="text"
                  name="supplier"
                  id="supplier"
                  v-model="newNomorhp"
                  class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Supplier"
                />
              </div>
            </div>
        </div>
        <div class="sm:col-span-4">
            <label
              for="unit"
              class="block text-sm font-medium leading-6 text-text-700"
              >Unit</label
            >
            <div class="mt-2">
              <div
                class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
              >
                <input
                  type="text"
                  name="unit"
                  id="unit"
                  v-model="newemail"
                  class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Unit"
                />
              </div>
            </div>
        </div>
        <div class="sm:col-span-4">
          <label
            for="kategori"
            class="block text-sm font-medium leading-6 text-text-700"
            >Kategori</label
          >
          <div class="mt-2">
            <div
              class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
            >
              <input
                type="text"
                name="kategori"
                id="kategori"
                v-model="newemail"
                class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Kategori"
              />
            </div>
          </div>
      </div>
        <div class="sm:col-span-4">
            <label
              for="hargabeli"
              class="block text-sm font-medium leading-6 text-text-700"
              >Harga Beli</label
            >
            <div class="mt-2">
              <div
                class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
              >
                <input
                  type="text"
                  name="hargabeli"
                  id="hargabeli"
                  v-model="newHargabeli"
                  class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Harga Beli"
                />
              </div>
            </div>
        </div>
        <div class="sm:col-span-4">
          <label
            for="hargajual"
            class="block text-sm font-medium leading-6 text-text-700"
            >Harga Jual</label
          >
          <div class="mt-2">
            <div
              class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
            >
              <input
                type="text"
                name="hargajual"
                id="hargajual"
                v-model="newHargajual"
                class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Harga Jual"
              />
            </div>
          </div>
      </div>
    </form>
</template>