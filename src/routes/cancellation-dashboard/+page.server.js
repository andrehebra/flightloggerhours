import { API_KEY } from '$env/static/private';

import gql from 'graphql-tag';
import { print } from 'graphql';

import { error } from '@sveltejs/kit';

const query = `query Query($all: Boolean, $after: String) {
	bookings(all: $all, after: $after) {
		pageInfo {
            endCursor
            hasNextPage
        }nodes {
            ... on SingleStudentBooking {
                startsAt
                endsAt
                student {
                    firstName
                    lastName
                }
                instructor {
                    firstName
                    lastName
                }
                cancellation {
                    title
                    comment
                    id
                }
            }
        }
    }
}`;

export const load = async () => {
    console.log('Load function called in page.server.js');
    try {
        const variables = {
            all: true,
        };

        const response = await fetch('https://api.flightlogger.net/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables
            })
        });

        let data = await response.json();
        let dataArray = [...data.data.bookings.nodes];
        //console.log(dataArray);

        while (data.data.bookings.pageInfo.hasNextPage == true) {
            const variables = {
                all: true,
                after: data.data.bookings.pageInfo.endCursor,
            }

            const response = await fetch('https://api.flightlogger.net/graphql', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables
                })
            });

            console.log(data.data.bookings.pageInfo.hasNextPage);

            data = await response.json();
            try {
                for (let i = 0; i < data.data.bookings.nodes.length; i++) {
                dataArray.push(data.data.bookings.nodes[i]);
                }
            } catch (e) {
                console.error("concatination error: " + e);

                return { dataArray };
            }

        }

        return { dataArray };
    } catch (error) {
        console.error(`Error in load function :( ${error}`);
    }
}