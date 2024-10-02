<script setup>
import { CardContent, CardHeader } from '@/components/ui/card/index.ts'
</script>

<template>
    <CardHeader>
      <div class="flex gap-1">
        <p class="pb-2">Title</p>
        <slot name="titleAddOn"></slot>
      </div>
      <slot name="title"></slot>
    </CardHeader>
    <CardContent class="flex-row">
      <div class="flex gap-1">
        <p>Description</p>
        <slot name="descriptionAddOn"></slot>
      </div>
      <slot name="description"></slot>
      <div class="flex justify-between">
        <div class="w-1/2 pr-6">
          <div class="w-full">
            <div class="flex gap-1">
              <p class="pb-2">Assignees</p>
              <slot name="assigneesAddOn"></slot>
            </div>
            <slot name="assignees"></slot>
            <p>Status:</p>
            <slot name="status"></slot>
          </div>
        </div>
        <div class="rounded-2xl w-1/2 shadow text-slate-700 mt-5">
          <div class="stat">
            <div class="stat-title">CreatedOn</div>
            <div class="stat-desc">
              <slot name="createdOn"></slot>
            </div>
          </div>

          <div class="stat">
            <div class="stat-title">UpdatedOn</div>
            <div class="stat-desc">
              <slot name="updatedOn"></slot>
            </div>
          </div>

          <div class="stat">
            <div class="stat-title">TimeZone</div>
            <div class="stat-desc">
              <slot name="timezone"></slot>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
</template>

<style scoped></style>
