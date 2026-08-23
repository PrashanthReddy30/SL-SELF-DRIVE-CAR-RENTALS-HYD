import { useState } from 'react';
import { useFleetStore } from '../../store/fleetStore';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import type { Car, CarCategory, Transmission } from '../../types';

export default function AdminCars() {
  const { cars, addCar, updateCar, deleteCar } = useFleetStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CarCategory>('Sedan');
  const [transmission, setTransmission] = useState<Transmission>('Automatic');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const openAddModal = () => {
    setEditingCar(null);
    setName('');
    setCategory('Sedan');
    setTransmission('Automatic');
    setPrice('');
    setImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (car: Car) => {
    setEditingCar(car);
    setName(car.name);
    setCategory(car.category);
    setTransmission(car.transmission);
    setPrice(car.pricePerDay.toString());
    setImageUrl(car.imageUrl);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCar) {
      updateCar(editingCar.id, {
        name, category, transmission, pricePerDay: Number(price), imageUrl
      });
    } else {
      addCar({
        id: Date.now().toString(),
        name, category, transmission, pricePerDay: Number(price), imageUrl
      });
    }
    setIsModalOpen(false);
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
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">CATEGORY</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">TRANSMISSION</th>
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
                  <td className="py-3 px-6">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">{car.category}</span>
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-600">{car.transmission}</td>
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
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-secondary">{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Car Model Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. Nissan GT-R" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Daily Price (INR)</label>
                <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none" placeholder="e.g. 5000" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="url" required value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none" placeholder="https://..." />
              </div>

              <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors mt-6">
                {editingCar ? 'Save Changes' : 'Add Car'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
