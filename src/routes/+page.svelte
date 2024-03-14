<script>
    import { Heading, P, Listgroup } from 'flowbite-svelte';

    let links = [
        {name: "Cancellation Dashboard", href: "/cancellation-dashboard"},

    ];
</script>

<Heading class="h1">Flight Logger Data</Heading>

<Listgroup active items={links} let:item class="w-48">
    {item.name}
</Listgroup>