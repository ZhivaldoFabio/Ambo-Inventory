<template>
    <form action="/action_page.php">
        <div class="sm:col-span-4">
            <label
              for="noinvoice"
              class="block text-sm font-medium leading-6 text-text-700"
              >No Invoice</label
            >
            <div class="mt-2">
              <div
                class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
              >
                <input
                  type="text"
                  name="noinvoice"
                  id="noinvoice"
                  v-model="newNoInvoice"
                  class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="No Invoice"
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
            <div class="sm:col-span-4">
                <label
                  for="hargaUnit"
                  class="block text-sm font-medium leading-6 text-text-700"
                  >Harga Unit</label
                >
                <div class="mt-2">
                  <div
                    class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
                  >
                    <input
                      type="text"
                      name="hargaunit"
                      id="hargaunit"
                      v-model="newHargaUnit"
                      class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Harga Unit"
                    />
                  </div>
                </div>
            </div>
            <div class="sm:col-span-4">
                <label
                  for="totalharga"
                  class="block text-sm font-medium leading-6 text-text-700"
                  >Total Harga</label
                >
                <div class="mt-2">
                  <div
                    class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
                  >
                    <input
                      type="text"
                      name="totalharga"
                      id="totalharga"
                      v-model="newTotalharga"
                      class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="TotalHarga"
                    />
                  </div>
                </div>
            </div>
    </form>
</template>