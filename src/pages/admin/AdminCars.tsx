import { useState } from 'react';
import { useFleetStore } from '../../store/fleetStore';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import type { Car, CarCategory, Transmission, FuelType } from '../../types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';

export default function AdminCars() {
  const { cars, addCar, updateCar, deleteCar } = useFleetStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [carNumbers, setCarNumbers] = useState<string[]>([]);
  const [currentNumberInput, setCurrentNumberInput] = useState('');
  const [category, setCategory] = useState<CarCategory>('Sedan');
  const [transmission, setTransmission] = useState<Transmission>('Automatic');
  const [fuelType, setFuelType] = useState<FuelType>('Petrol');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const openAddModal = () => {
    setEditingCar(null);
    setName('');
    setCarNumbers([]);
    setCurrentNumberInput('');
    setCategory('Sedan');
    setTransmission('Automatic');
    setFuelType('Petrol');
    setPrice('');
    setImageUrl('');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (car: Car) => {
    setEditingCar(car);
    setName(car.name);
    
    const initialNumbers = car.carNumbers ? [...car.carNumbers] : [];
    if (car.carNumber && !initialNumbers.includes(car.carNumber)) {
      initialNumbers.push(car.carNumber);
    }
    setCarNumbers(initialNumbers);
    setCurrentNumberInput('');
    
    setCategory(car.category);
    setTransmission(car.transmission);
    setFuelType(car.fuelType || 'Petrol');
    setPrice(car.pricePerDay.toString());
    setImageUrl(car.imageUrl);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar && !imageUrl && !imageFile) {
      alert("Please provide an image URL or upload an image.");
      return;
    }
    
    setIsUploading(true);
    let finalImageUrl = imageUrl.trim();

    try {
      if (imageFile) {
        const storageRef = ref(storage, `cars/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      const finalCarNumbers = [...carNumbers];
      if (currentNumberInput.trim() && !finalCarNumbers.includes(currentNumberInput.trim())) {
        finalCarNumbers.push(currentNumberInput.trim());
      }

      if (editingCar) {
        updateCar(editingCar.id, {
          name, carNumbers: finalCarNumbers, category, transmission, fuelType, pricePerDay: Number(price), 
          imageUrl: finalImageUrl || editingCar.imageUrl
        });
      } else {
        addCar({
          id: Date.now().toString(),
          name, carNumbers: finalCarNumbers, category, transmission, fuelType, pricePerDay: Number(price), imageUrl: finalImageUrl
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddNumber = () => {
    if (currentNumberInput.trim() && !carNumbers.includes(currentNumberInput.trim())) {
      setCarNumbers([...carNumbers, currentNumberInput.trim()]);
      setCurrentNumberInput('');
    }
  };

  const handleRemoveNumber = (index: number) => {
    setCarNumbers(carNumbers.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Fleet Management</h1>
        <button 
          onClick={openAddModal}
          className="bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary-hover transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Add New Car
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200">
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">IMAGE</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">NAME</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">REG NO.</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">CATEGORY</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">TRANSMISSION</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">FUEL</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">PRICE/DAY</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-6">
                    <img src={car.imageUrl} alt={car.name} className="w-16 h-12 object-cover rounded-md" />
                  </td>
                  <td className="py-3 px-6 font-bold text-secondary">{car.name}</td>
                  <td className="py-3 px-6 text-sm font-medium text-gray-500">
                    {car.carNumbers && car.carNumbers.length > 0 
                      ? car.carNumbers.join(', ') 
                      : (car.carNumber || '-')}
                  </td>
                  <td className="py-3 px-6">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">{car.category}</span>
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-600">{car.transmission}</td>
                  <td className="py-3 px-6 text-sm text-gray-600">{car.fuelType}</td>
                  <td className="py-3 px-6 font-semibold text-secondary">₹{car.pricePerDay}</td>
                  <td className="py-3 px-6 text-right">
                    <button onClick={() => openEditModal(car)} className="text-blue-500 hover:text-blue-700 p-2"><Edit size={18} /></button>
                    <button onClick={() => {if(confirm('Are you sure?')) deleteCar(car.id)}} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-secondary/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-secondary">{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Car Model Name</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. Nissan GT-R" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Numbers</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={currentNumberInput} 
                      onChange={e => setCurrentNumberInput(e.target.value)} 
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddNumber(); } }}
                      className="flex-1 min-w-[120px] border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                      placeholder="e.g. TS 09 EA 1234" 
                    />
                    <button type="button" onClick={handleAddNumber} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors">Add</button>
                  </div>
                  {carNumbers.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {carNumbers.map((num, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                          <span className="text-sm font-semibold text-gray-700">{idx + 1}. {num}</span>
                          <button type="button" onClick={() => handleRemoveNumber(idx)} className="text-red-400 hover:text-red-600"><X size={16} /></button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value as CarCategory)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none bg-white">
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                  <select value={transmission} onChange={e => setTransmission(e.target.value as Transmission)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none bg-white">
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                  <select value={fuelType} onChange={e => setFuelType(e.target.value as FuelType)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none bg-white">
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Daily Price (INR)</label>
                <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none" placeholder="e.g. 5000" />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Car Image</label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <label className="flex-1">
                      <span className="text-xs text-gray-500 mb-1 block">Upload Local Image</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => { setImageFile(e.target.files?.[0] || null); setImageUrl(''); }}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                    </label>
                  </div>
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-semibold">OR PASTE URL</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>
                  <div>
                    <input 
                      type="text" 
                      value={imageUrl} 
                      onChange={e => { setImageUrl(e.target.value); setImageFile(null); }} 
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none" 
                      placeholder={editingCar ? "Leave empty to keep existing image" : "https://..."} 
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isUploading} className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors mt-6 disabled:opacity-50">
                {isUploading ? 'Uploading...' : editingCar ? 'Save Changes' : 'Add Car'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
