import {
    AssignmentData,
    ClientData,
    StaffData,
    TrainingModuleData,
    VillageData,
} from "./data-model/models/dataTypes";
import Village from "./data-model/models/Village";
import database, {
    trainingEventCollection,
    trainingModuleCollection,
    villageCollection,
    clientCollection,
    staffCollection,
    assignmentCollection,
    participantCollection,
} from "./database";

export const logRecords = async (collection: string) => {
    let data;

    switch (collection) {
        case "trainingModule":
            data = await trainingModuleCollection.query().fetch();
            break;

        case "trainingEvent":
            data = await trainingEventCollection.query().fetch();
            break;

        case "village":
            data = await villageCollection.query().fetch();
            break;

        case "client":
            data = await clientCollection.query().fetch();
            break;

        case "staff":
            data = await staffCollection.query().fetch();
            break;

        case "assignment":
            data = await assignmentCollection.query().fetch();
            break;

        case "participant":
            data = await participantCollection.query().fetch();
            break;

        default:
            break;
    }

    if (data) {
        if (data.length < 1) console.log("No records");

        data.forEach((e) => {
            console.log(JSON.stringify(e._raw, null, 4));
        });
    }
};

export const replaceVillages = async (newData: VillageData[]) => {
    const currentRecords = await villageCollection.query().fetch();
    const deleteOperations = currentRecords.map((r) =>
        r.prepareDestroyPermanently()
    );
    const createOperations = newData.map((d) =>
        villageCollection.prepareCreate((r) => {
            r._raw.id = d.id;
            r._raw._status = "synced";
            r.name = d.name;
            r.zoneCode = d.zone_code;
            r.zoneName = d.zone_name;
            r.districtCode = d.district_code;
            r.districtName = d.district_name;
            r.countryCode = d.country_code;
            r.countryName = d.country_name;
            r.isActive = d.is_active;
            r.latitude = d.latitude;
            r.longitude = d.longitude;
        })
    );

    await database.write(async () => {
        await database.batch(deleteOperations);
        console.log(
            `${deleteOperations.length} records have been deleted from the village table.`
        );
        await database.batch(createOperations);
        console.log(
            `${createOperations.length} records have been created in the village table.`
        );
    });
};

export const replaceClients = async (newData: ClientData[]) => {
    const currentRecords = await clientCollection.query().fetch();
    const deleteOperations = currentRecords.map((r) =>
        r.prepareDestroyPermanently()
    );

    const createOperations = newData.map((d) =>
        clientCollection.prepareCreate((r) => {
            r._raw.id = d.id;
            r._raw._status = "synced";
            r.firstName = d.first_name;
            r.lastName = d.last_name;
            r.sex = d.sex;
            r.ageGroup = d.age_group;
            r.phone1 = d.phone_1;
            r.phone2 = d.phone_2;
            r.isLeader = d.is_leader;
            r.village.id = d.village;
        })
    );

    await database.write(async () => {
        await database.batch(deleteOperations);
        console.log(
            `${deleteOperations.length} records have been deleted from the client table.`
        );
        await database.batch(createOperations);
        console.log(
            `${createOperations.length} records have been created in the client table.`
        );
    });
};

export const replaceTrainingModules = async (newData: TrainingModuleData[]) => {
    const currentRecords = await trainingModuleCollection.query().fetch();
    const deleteOperations = currentRecords.map((r) =>
        r.prepareDestroyPermanently()
    );
    const createOperations = newData.map((d) =>
        trainingModuleCollection.prepareCreate((r) => {
            r._raw.id = d.id;
            r._raw._status = "synced";
            r.name = d.name;
            r.topic = d.topic;
            r.country = d.country;
            r.startDate = d.start_date;
            r.endDate = d.end_date;
            r.isActive = d.is_active;
        })
    );

    await database.write(async () => {
        await database.batch(deleteOperations);
        console.log(
            `${deleteOperations.length} records have been deleted from the training module table.`
        );
        await database.batch(createOperations);
        console.log(
            `${createOperations.length} records have been created in the training module table.`
        );
    });
};

export const replaceStaff = async (newData: StaffData[]) => {
    const currentRecords = await staffCollection.query().fetch();
    const deleteOperations = currentRecords.map((r) =>
        r.prepareDestroyPermanently()
    );
    const createOperations = newData.map((d) =>
        staffCollection.prepareCreate((r) => {
            r._raw.id = d.id;
            r._raw._status = "synced";
            r.firstName = d.first_name;
            r.lastName = d.last_name;
            r.roleId = d.role_id;
            r.roleName = d.role_name;
            r.country = d.country;
        })
    );

    await database.write(async () => {
        await database.batch(deleteOperations);
        console.log(
            `${deleteOperations.length} records have been deleted from the staff table.`
        );
        await database.batch(createOperations);
        console.log(
            `${createOperations.length} records have been created in the staff table.`
        );
    });
};

export const replaceAssignments = async (newData: AssignmentData[]) => {
    const currentRecords = await assignmentCollection.query().fetch();
    const deleteOperations = currentRecords.map((r) =>
        r.prepareDestroyPermanently()
    );
    const createOperations = newData.map((d) =>
        assignmentCollection.prepareCreate((r) => {
            r._raw.id = d.id;
            r._raw._status = "synced";
            r.staff.id = d.staff;
            r.village.id = d.village;
            r.startDate = d.start_date;
            r.endDate = d.end_date;
        })
    );

    await database.write(async () => {
        await database.batch(deleteOperations);
        console.log(
            `${deleteOperations.length} records have been deleted from the assignment table.`
        );
        await database.batch(createOperations);
        console.log(
            `${createOperations.length} records have been created in the assignment table.`
        );
    });
};
