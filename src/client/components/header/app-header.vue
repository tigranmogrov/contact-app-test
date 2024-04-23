<script setup lang="ts">
import { RouteNameEnum } from '@/enums/router.enum.ts';
</script>

<template>
  <header class="app-header">
    <div class="app-container">
      <div class="app-header__inner">
        <RouterLink
          :to="{ name: RouteNameEnum.Home }"
          class="app-header__logo has-text-dark is-size-5"
        >
          ContactApp
        </RouterLink>

        <RouterLink :to="{ name: RouteNameEnum.Contacts }" class="button is-small is-dark">
          До списку контактів
        </RouterLink>
      </div>
    </div>
  </header>
</template>
