<template>
    <form action="/action_page.php">
        <div class="sm:col-span-4">
            <label
              for="tanggal"
              class="block text-sm font-medium leading-6 text-text-700"
              >Tanggal</label
            >
            <div class="mt-2">
              <div
                class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
              >
                <input
                  type="text"
                  name="tanggal"
                  id="tanggal"
                  v-model="newtanggal"
                  class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Tanggal"
                />
              </div>
            </div>
        </div>
        <div class="sm:col-span-4">
            <label
              for="kodepesanan"
              class="block text-sm font-medium leading-6 text-text-700"
              >Kode Pemesanan</label
            >
            <div class="mt-2">
              <div
                class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
              >
                <input
                  type="text"
                  name="kodepesanan"
                  id="kodepesanan"
                  v-model="newkodepesanan"
                  class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Kode Pemesanan"
                />
              </div>
            </div>
        </div>
        <div class="sm:col-span-4">
            <label
              for="supplier"
              class="block text-sm font-medium leading-6 text-text-700"
              >Nama Supplier</label
            >
            <div class="mt-2">
              <div
                class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
              >
                <input
                  type="text"
                  name="supplier"
                  id="supplier"
                  v-model="newsupplier"
                  class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Nama Supplier"
                />
              </div>
            </div>
        </div>
         <div class="sm:col-span-4">
            <label
              for="tanggal"
              class="block text-sm font-medium leading-6 text-text-700"
              >Tanggal</label
            >
            <div class="mt-2">
              <div
                class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
              >
                <input
                  type="text"
                  name="tanggal"
                  id="tanggal"
                  v-model="newtanggal"
                  class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Tanggal"
                />
              </div>
            </div>
        </div>
        <form action="/action_page.php">
            <div class="sm:col-span-4">
                <label
                  for="namaKategori"
                  class="block text-sm font-medium leading-6 text-text-700"
                  >Nama Kategori</label
                >
                <div class="mt-2">
                  <div
                    class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
                  >
                    <input
                      type="text"
                      name="namakategori"
                      id="namakategori"
                      v-model="newKategoriname"
                      class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Nama Kategori"
                    />
                  </div>
                </div>
            </div>
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
                  for="qty"
                  class="block text-sm font-medium leading-6 text-text-700"
                  >Qty</label
                >
                <div class="mt-2">
                  <div
                    class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
                  >
                    <input
                      type="text"
                      name="jumlahqty"
                      id="jumlahqty"
                      v-model="newqty"
                      class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Qty"
                    />
                  </div>
                </div>
            </div>
            <div class="sm:col-span-4">
                <label
                  for="namaUnit"
                  class="block text-sm font-medium leading-6 text-text-700"
                  >Nama Unit</label
                >
                <div class="mt-2">
                  <div
                    class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
                  >
                    <input
                      type="text"
                      name="namaunit"
                      id="namaunit"
                      v-model="newUnitname"
                      class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Nama Unit"
                    />
                  </div>
                </div>
            </div>
    </form>
</template>