<template>
<div>


<section id="grad" class="section">
    <div class="container is-fluid">
        

    <div>

        <router-link :to="{ name: 'windgram', params: {id: 'broomfield' }}" tag="a" active-class='is-active' exact class="homebutton button is-primary  is-inverted is-outlined">Broomfield</router-link>

        <router-link :to="{ name: 'windgram', params: {id: 'copper' }}" tag="a" active-class='is-active' exact class="homebutton button is-primary  is-inverted is-outlined">Copper</router-link>

        <router-link :to="{ name: 'arrow'}" tag="a" active-class='is-active' exact class="homebutton button is-primary  is-inverted is-outlined">Arrow</router-link>


    </div>

   
    </div>
</section>
</div>
</template>

<script>
import moment from 'moment';

export default {
 


}
</script>

<style>
.box, .notification{
    background-color: transparent !important;
}
.notification{
    color: #fff;
}

.homebutton {
    width: 150px;
    margin: 10px;
    display: inline-block;
}

.wrap {
    text-align: center;
}


</style>