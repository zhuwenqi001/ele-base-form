<template>
  <p>{{temp}}</p>
</template>

<script>
export default {
  name: 'basic',
  data () {
    return {
      temp: ['1', '2']
    }
  },
  mounted () {
    const { temp } = this
    console.log(...temp)
  }
}
</script>
