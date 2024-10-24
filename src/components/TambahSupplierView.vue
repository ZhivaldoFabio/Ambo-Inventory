<template>
    <form action="/action_page.php">
        <div class="sm:col-span-4">
            <label
              for="namasupplier"
              class="block text-sm font-medium leading-6 text-text-700"
              >Nama Supplier</label
            >
            <div class="mt-2">
              <div
                class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
              >
                <input
                  type="text"
                  name="namasupplier"
                  id="namasupplier"
                  v-model="newSuppliername"
                  class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Nama Supplier"
                />
              </div>
            </div>
        </div>
        <div class="sm:col-span-4">
            <label
              for="nomorhp"
              class="block text-sm font-medium leading-6 text-text-700"
              >Nomor HP</label
            >
            <div class="mt-2">
              <div
                class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
              >
                <input
                  type="text"
                  name="nomorHP"
                  id="nomorHP"
                  v-model="newNomorhp"
                  class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Nomor HP"
                />
              </div>
            </div>
        </div>
        <div class="sm:col-span-4">
            <label
              for="emailaddress"
              class="block text-sm font-medium leading-6 text-text-700"
              >Alamat Email</label
            >
            <div class="mt-2">
              <div
                class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
              >
                <input
                  type="text"
                  name="alamatemail"
                  id="alamatemail"
                  v-model="newemail"
                  class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Alamat Email"
                />
              </div>
            </div>
        </div>
        <div class="sm:col-span-4">
            <label
              for="alamatkantor"
              class="block text-sm font-medium leading-6 text-text-700"
              >Alamat Kantor</label
            >
            <div class="mt-2">
              <div
                class="flex rounded-md shadow-sm ring-1 ring-inset ring-text-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
              >
                <input
                  type="text"
                  name="alamatkantor"
                  id="alamatkantor"
                  v-model="newalamatkantor"
                  class="block rounded-md flex-1 border-0 py-1.5 pl-2 text-text-700 shadow-sm ring-1 ring-inset ring-text-300 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Alamat Kantor"
                />
              </div>
            </div>
        </div>
    </form>
</template>