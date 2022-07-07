<template>
  <table-detail :is-edit="false" />
</template>

<script>
import TableDetail from '@/views/table/components/TableDetail'

export default {
  name: 'CreateArticle',
  components: { TableDetail }
}
</script>
