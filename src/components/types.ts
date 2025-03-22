export type CrowdstrikeData = {
    name: string;
    device: string;
    path: string;
    status: 'scheduled' | 'available';
};

export type CrowdstrikeColumns = {
    title: string;
    key: string;
}