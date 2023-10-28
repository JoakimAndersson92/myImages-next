import { useState, useEffect } from 'react';

export default function EditExlusiveCollection({ exclusiveCollection, photographers }) {
  console.log(exclusiveCollection)

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    information: '',
    heroImage: null,
    photographerPersonID: ''
  });

  useEffect(() => {
    if (exclusiveCollection) {
      setFormData({
        title: exclusiveCollection.title || '',
        subtitle: exclusiveCollection.subtitle || '',
        information: exclusiveCollection.information || '',
        heroImage: null, // Keep this as null because it's a file input
        photographerPersonID: exclusiveCollection.photographerPersonID || ''
      });
    }
  }, [exclusiveCollection]);

  const handleChange = (e) => {
    if (e.target.name === 'heroImage') {
      setFormData({
        ...formData,
        heroImage: e.target.files[0],  // store the File object
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    for (let key in formData) {
      formDataObj.append(key, formData[key]);
    }

    try {
      const response = await fetch('/api/application/collections/uploadExclusiveCollection', {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        console.log(response.statusText)
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error uploading collection:", error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 shadow-md mt-10 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Edit Exclusive Collection</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Title:</label>
          <input 
            className="mt-1 p-2 w-full border rounded-md" 
            type="text" 
            name="title" 
            value={formData.title}
            onChange={handleChange} 
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Subtitle:</label>
          <input 
            className="mt-1 p-2 w-full border rounded-md" 
            type="text" 
            name="subtitle" 
            value={formData.subtitle}
            onChange={handleChange} 
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Information:</label>
          <textarea 
            className="mt-1 p-2 w-full border rounded-md" 
            name="information" 
            value={formData.information}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Hero Image:</label>
          <input
            className="mt-1 p-2 w-full border rounded-md"
            type="file"
            name="heroImage"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Photographer:</label>
          <select
            className="mt-1 p-2 w-full border rounded-md"
            name="photographerPersonID"
            value={formData.photographerPersonID}
            onChange={handleChange}
          >
            <option value="">Select a photographer</option>
            {photographers.map(photographer => (
              <option key={photographer.personID} value={photographer.personID}>
                {photographer.firstName}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-6">
          <input className="cursor-pointer bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600" type="submit" value="Update Collection" />
        </div>
      </form>
    </div>
  );
}
