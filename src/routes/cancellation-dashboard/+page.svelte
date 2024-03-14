<script>
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { Label, Input, Button } from 'flowbite-svelte';
    import { Heading , Hr} from 'flowbite-svelte';
    import { Progressbar } from 'flowbite-svelte';
    import { sineOut } from 'svelte/easing';
    import { DarkMode } from 'flowbite-svelte';




    import rates from '$lib/shared/stores/rates';
    export let data;

    data.latest && rates.set(data.latest);

    let firstName = "";
    let lastName = "";
    let attendanceRate = 0;

    $: firstName;
    $: lastName;

    let reservationCount = 0;
    let cancellationCount = 0;
    
    let cancellationArray = [];
    let cancellationReasons = {
        "Aircraft/Sim Unavailable": 0,
        "Client - sick": 0,
        "Client - client discontinued training": 0,
        "Client - family emergency": 0,
        "Client - fatigue": 0,
        "Client - forgot booking": 0,
        "Client - injury": 0,
        "Client - no show/no-call": 0,
        "Client - overslept": 0,
        "Client - personal scheduling conflict": 0,
        "Client - short notice cancellation": 0,
        "Client - technical issue (remote session)": 0,
        "Client - transportation issue": 0,
        "Client - unprepared for lesson": 0,
        "Instructor - instructor is sick": 0,
        "Instructor - personal scheduling conflict": 0,
        "Maintenance issue - before start": 0,
        "Maintenance issue - after start": 0,
        "Crew - unavailable": 0,
        "Flight Training Professionals": 0,
        "Other": 0,
        "Reschedule - booking is not needed": 0,
        "Reschedule - changing booking": 0,
        "Reschedule - client has completed the course": 0,
        "Reschedule - client is schedule for progress check": 0,
        "Reschedule - scheduling error": 0,
        "Test booking - system operations check": 0,
        "Test booking - training": 0,
        "Weather - excessive crosswinds": 0,
        "Weather - excessive total winds": 0,
        "Weather - low cloud layers/ceilings": 0,
        "Weather - low visibilities": 0,
        "Weather - thunderstorms": 0
    };

    let dataArray = [...data.dataArray];

    const currentDate = new Date();
    const currentISODate = currentDate.toISOString().slice(0, -5);

    function calculate() {
        reservationCount = 0;
        cancellationCount = 0;

        cancellationArray = [];

        for (let i = 0; i < dataArray.length; i++) {
            if (JSON.stringify(dataArray[i]) != '{}') {
                if (firstName == dataArray[i].student.firstName && lastName == dataArray[i].student.lastName && dataArray[i].startsAt < currentISODate) {
                    console.log(dataArray[i].startsAt);

                    reservationCount++;

                    if (dataArray[i].cancellation != null) {
                        cancellationCount++;
                        cancellationArray.push({
                            title: dataArray[i].cancellation.title,
                            date: dataArray[i].startsAt,
                            instructor: dataArray[i].instructor.firstName + " " + dataArray[i].instructor.lastName
                        });
                        cancellationReasons[dataArray[i].cancellation.title] = cancellationReasons[dataArray[i].cancellation.title] + 1;
                    }
                }
            }
            
        }

        attendanceRate = parseInt((1 - (cancellationCount / reservationCount)) * 100)

        cancellationArray = cancellationArray;
    }
    
</script>

<head>
    <title>Cancellation Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
</head>

<div class="container">

<Heading tag='h1'>Cancellation Dashboard</Heading>

<Hr />

<div class="mb-6">
    <Label for="first-name" class="block mb-2">First Name</Label>
    <Input bind:value={firstName} id="default-input" placeholder="" />
</div>
<div class="mb-6">
    <Label for="first-name" class="block mb-2">Last Name</Label>
    <Input bind:value={lastName} id="default-input" placeholder="" />
</div>
<Button on:click={ calculate }>Submit</Button>

<Hr />

<Heading tag='h4'>Total Reservations: { reservationCount }</Heading>
<Heading tag='h4'>Total Cancellations: { cancellationCount }</Heading>

<Hr />

<Progressbar animate
    precision={1}
    labelOutside="Attendance Rate (Overall)"
    labelInside
    tweenDuration={1500}
    easing={sineOut}
    size="h-6"
    labelInsideClass="bg-blue-600 text-blue-100 text-base font-medium text-center p-1 leading-none rounded-full"
    class="mb-8"progress={attendanceRate} />

<Progressbar animate
    precision={1}
    labelOutside="Controllable Attendance Rate (Excluding Non-Controllable)"
    labelInside
    tweenDuration={1500}
    easing={sineOut}
    size="h-6"
    labelInsideClass="bg-blue-600 text-blue-100 text-base font-medium text-center p-1 leading-none rounded-full"
    class="mb-8"progress={attendanceRate} />

<Hr />

<Heading tag='h2'>All Cancellations</Heading>
<Table>
    <TableHead>
        <TableHeadCell>Date</TableHeadCell>
        <TableHeadCell>Cancellation Reason</TableHeadCell>
        <TableHeadCell>Instructor Name</TableHeadCell>
    </TableHead>
    <TableBody>
        {#each cancellationArray as cancellationObject}
            <TableBodyRow>
                <TableBodyCell>{cancellationObject.date}</TableBodyCell>
                <TableBodyCell>{cancellationObject.title}</TableBodyCell>
                <TableBodyCell>{cancellationObject.instructor}</TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>

<Hr />
<Heading tag='h2'>Cancellation Table</Heading>

<Table>
    <TableHead>
        <TableHeadCell>Cancellation Reason</TableHeadCell>
        <TableHeadCell>Total</TableHeadCell>
        <TableHeadCell>Controllable</TableHeadCell>
        <TableHeadCell>Non-Controllable</TableHeadCell>
    </TableHead>
    <TableBody>
        <TableBodyRow>
            <TableBodyCell>Aircraft/Sim Unavailable</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Aircraft/Sim Unavailable"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Aircraft/Sim Unavailable"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Client - sick</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - sick"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - sick"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Client - client discontinued training</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - client discontinued training"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - client discontinued training"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Client - family emergency</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - family emergency"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - family emergency"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Client - fatigue</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - fatigue"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - fatigue"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Client - forgot booking</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - forgot booking"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - forgot booking"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Client - injury</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - injury"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - injury"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Client - no show/no-call</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - no show/no-call"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - no show/no-call"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Client - overslept</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - overslept"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - overslept"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Client - personal scheduling conflict</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - personal scheduling conflict"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - personal scheduling conflict"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Client - short notice cancellation</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - short notice cancellation"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - short notice cancellation"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Client - technical issue (remote session)</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - technical issue (remote session)"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - technical issue (remote session)"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Client - transportation issue</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - transportation issue"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - transportation issue"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Client - unprepared for lesson</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - unprepared for lesson"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Client - unprepared for lesson"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Instructor - instructor is sick</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Instructor - instructor is sick"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Instructor - instructor is sick"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Instructor - personal scheduling conflict</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Instructor - personal scheduling conflict"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Instructor - personal scheduling conflict"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Maintenance issue - before start</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Maintenance issue - before start"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Maintenance issue - before start"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Maintenance issue - after start</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Maintenance issue - after start"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Maintenance issue - after start"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Crew - unavailable</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Crew - unavailable"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Crew - unavailable"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Flight Training Professionals</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Flight Training Professionals"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Flight Training Professionals"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Other</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Other"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Other"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Reschedule - booking is not needed</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Reschedule - booking is not needed"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Reschedule - booking is not needed"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Reschedule - changing booking</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Reschedule - changing booking"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Reschedule - changing booking"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Reschedule - client has completed the course</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Reschedule - client has completed the course"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Reschedule - client has completed the course"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Reschedule - client is schedule for progress check</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Reschedule - client is schedule for progress check"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Reschedule - client is schedule for progress check"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Reschedule - scheduling error</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Reschedule - scheduling error"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Reschedule - scheduling error"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Test booking - system operations check</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Test booking - system operations check"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Test booking - system operations check"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Test booking - training</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Test booking - training"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Test booking - training"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Test booking - training</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Test booking - training"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Test booking - training"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Weather - excessive total winds</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Weather - excessive total winds"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Weather - excessive total winds"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Weather - low cloud layers/ceilings</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Weather - low cloud layers/ceilings"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Weather - low cloud layers/ceilings"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Weather - low visibilities</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Weather - low visibilities"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Weather - low visibilities"] }</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Weather - thunderstorms</TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Weather - thunderstorms"] }</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>{ cancellationReasons["Weather - thunderstorms"] }</TableBodyCell>
        </TableBodyRow>
        
    </TableBody>
</Table>



</div>

<style>
   .container {
    padding: 20px;
   }
</style>