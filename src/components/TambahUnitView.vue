<template>
    <form action="/action_page.php">
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
</template>