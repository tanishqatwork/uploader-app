const mockDatasets = [
    {
        id: '1',
        name: 'Sample Dataset 1',
        description: 'This is a sample dataset.',
        category: 'web_scraping',
        file_url: 'http://example.com/file1.csv',
        file_name: 'file1.csv',
        data: [
            { id: 1, name: 'John Doe', age: 30 },
            { id: 2, name: 'Jane Smith', age: 25 },
        ],
        columns: ['id', 'name', 'age'],
        row_count: 2,
        created_date: new Date().toISOString(),
        analysis: {
            summary: "This is a sample analysis.",
            insights: ["Insight 1", "Insight 2"],
        }
    },
    {
        id: '2',
        name: 'Another Sample Dataset',
        description: 'This is another sample dataset.',
        category: 'marketing',
        file_url: 'http://example.com/file2.csv',
        file_name: 'file2.csv',
        data: [
            { product: 'A', sales: 100 },
            { product: 'B', sales: 150 },
        ],
        columns: ['product', 'sales'],
        row_count: 2,
        created_date: new Date().toISOString(),
        analysis: {
            summary: "Some other analysis.",
            insights: ["Marketing insight 1"],
        }
    }
];

const list = async (sort) => {
    // a simple sort for "-created_date"
    if (sort === "-created_date") {
        return [...mockDatasets].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }
    return mockDatasets;
};

const create = async (newDataset) => {
    const dataset = {
        ...newDataset,
        id: String(mockDatasets.length + 1),
        created_date: new Date().toISOString(),
    };
    mockDatasets.push(dataset);
    return dataset;
};

export const Dataset = {
    list,
    create,
}; 