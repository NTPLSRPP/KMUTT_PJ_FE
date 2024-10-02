<script setup>
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card/index.ts'
</script>

<template>
  <CardHeader>
    <div class="flex gap-1">
      <p class="pb-2">Status name :</p>
      <slot name="nameAddOn"></slot>
    </div>
    <slot name="name"></slot>
  </CardHeader>
  <CardContent class="flex flex-col">
    <div class="flex gap-1">
      <p class="pb-2">Description :</p>
      <slot name="descriptionAddOn"></slot>
    </div>
    <slot name="description"></slot>
    <p class="pb-2">Enable Limit:</p>
    <slot name="limit"></slot>
  </CardContent>
</template>

<style scoped></style>
