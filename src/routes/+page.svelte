<script>
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { Label, Input, Button } from 'flowbite-svelte';
    import { Heading , Hr} from 'flowbite-svelte';
    import { Progressbar } from 'flowbite-svelte';
    import { sineOut } from 'svelte/easing';
    import { DarkMode } from 'flowbite-svelte';

    export let data;

    let firstName = "";
    let lastName = "";
    let attendanceRate = 0;

    $: firstName;
    $: lastName;

    let reservationCount = 0;
    let cancellationCount = 0;

    let cancellationArray = [];
    
    

    let dataArray = [...data.dataArray];

    //console.log(dataArray);

    const currentDate = new Date();
    const currentISODate = currentDate.toISOString().slice(0, -5);
    let instructorList = [];

    function calculate() {

        //let instructorList = [];

        for (let i = 0; i < dataArray.length; i++) {
            let caught = 0;
            if (dataArray[i] != null && dataArray[i].instructor != null && dataArray[i].plannedLesson != null) {
                for (let j = 0; j < instructorList.length; j++) {
                    if (dataArray[i].instructor.firstName == instructorList[j].firstName && dataArray[i].instructor.lastName == instructorList[j].lastName) {
                        caught = 1;
                    }
                }

                if (caught == 0) {
                    instructorList.push({
                        firstName: dataArray[i].instructor.firstName,
                        lastName: dataArray[i].instructor.lastName,
                        briefingSeconds: dataArray[i].plannedLesson.briefingSeconds,
                        totalSeconds: dataArray[i].plannedLesson.totalSeconds,
                        debriefingSeconds: dataArray[i].plannedLesson.debriefingSeconds,
                    })
                } else if (caught == 1) {
                    for (let j = 0; j < instructorList.length; j++) {
                        if (dataArray[i].instructor.firstName == instructorList[j].firstName && dataArray[i].instructor.lastName == instructorList[j].lastName) {
                            instructorList[j].briefingSeconds += dataArray[i].plannedLesson.briefingSeconds;
                            instructorList[j].totalSeconds += dataArray[i].plannedLesson.totalSeconds;
                            instructorList[j].debriefingSeconds += dataArray[i].plannedLesson.debriefingSeconds;
                        }
                    }
                } else {
                    console.log("This was not caught for some reason" + dataArray[i]);
                }
            } else {
                console.log(dataArray[i]);
            }
            
        }

        //console.log(instructorList);
    }
    
</script>

<head>
    <title>Hours Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
</head>

<div class="container">

<Heading tag='h1'>Hours Dashboard</Heading>

<Hr />


<Button on:click={ calculate }>Submit</Button>

<Hr />



<Heading tag='h2'>All Hours for Period</Heading>
<Table>
    <TableHead>
        <TableHeadCell>Instructor</TableHeadCell>
        <TableHeadCell>Briefing</TableHeadCell>
        <TableHeadCell>Flight</TableHeadCell>
        <TableHeadCell>Debfiefing</TableHeadCell>
        <TableHeadCell>Total</TableHeadCell>
    </TableHead>
    <TableBody>
        {#each instructorList as instructor}
            <TableBodyRow>
                <TableBodyCell>{instructor.firstName} {instructor.lastName}</TableBodyCell>
                <TableBodyCell>{instructor.briefingSeconds / 60 / 60}</TableBodyCell>
                <TableBodyCell>{instructor.totalSeconds / 60 / 60}</TableBodyCell>
                <TableBodyCell>{instructor.debriefingSeconds / 60 / 60}</TableBodyCell>
                <TableBodyCell>{(instructor.debriefingSeconds + instructor.totalSeconds + instructor.briefingSeconds) / 60 / 60}</TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>




</div>

<style>
   .container {
    padding: 20px;
   }
</style>