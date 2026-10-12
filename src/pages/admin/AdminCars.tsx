import { useState } from 'react';
import { useFleetStore } from '../../store/fleetStore';
import { Edit, Trash2, Plus, X, User, Check, Car as CarIcon, ShieldCheck } from 'lucide-react';
import type { Car, CarCategory, Transmission, FuelType, CarRegistration } from '../../types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import toast from 'react-hot-toast';

export default function AdminCars() {
  const { cars, addCar, updateCar, deleteCar } = useFleetStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [regNoInput, setRegNoInput] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [carNumbers, setCarNumbers] = useState<CarRegistration[]>([]);
  const [editingUnitIndex, setEditingUnitIndex] = useState<number | null>(null);

  const [category, setCategory] = useState<CarCategory>('Sedan');
  const [seats, setSeats] = useState<number | ''>('');
  const [transmission, setTransmission] = useState<Transmission>('Automatic');
  const [fuelType, setFuelType] = useState<FuelType>('Petrol');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Helper to extract all registrations and owners from a Car document
  const extractRegistrations = (car: Car): CarRegistration[] => {
    const list: CarRegistration[] = [];
    if (Array.isArray(car.carNumbers) && car.carNumbers.length > 0) {
      car.carNumbers.forEach((cn) => {
        if (typeof cn === 'string') {
          const str = (cn as string).trim();
          if (str) {
            list.push({
              number: str,
              owner: (car.owner || '').trim(),
              ownerPhone: (car.ownerPhone || '').trim(),
            });
          }
        } else if (cn && typeof cn === 'object') {
          const num = (cn.number || '').trim();
          if (num || cn.owner) {
            list.push({
              number: num,
              owner: (cn.owner || car.owner || '').trim(),
              ownerPhone: (cn.ownerPhone || car.ownerPhone || '').trim(),
            });
          }
        }
      });
    }

    const singleNum = (car.registrationNumber || car.regNo || car.carNumber || '').trim();
    const singleOwner = (car.owner || '').trim();
    const singlePhone = (car.ownerPhone || '').trim();

    if (singleNum && !list.some((item) => item.number.toUpperCase() === singleNum.toUpperCase())) {
      list.push({
        number: singleNum,
        owner: singleOwner,
        ownerPhone: singlePhone,
      });
    }

    if (list.length === 0 && (singleOwner || singlePhone)) {
      list.push({
        number: singleNum,
        owner: singleOwner,
        ownerPhone: singlePhone,
      });
    }

    return list;
  };

  const getDisplayRegNo = (car: Car): string => {
    const list = extractRegistrations(car);
    if (list.length > 0) {
      const numbers = list.map((item) => item.number).filter(Boolean);
      if (numbers.length > 0) return numbers.join(', ');
    }
    return car.registrationNumber || car.regNo || car.carNumber || '-';
  };

  const getDisplayOwner = (car: Car): string => {
    const list = extractRegistrations(car);
    if (list.length > 0) {
      const owners = list
        .map((item) => {
          if (!item.owner) return '';
          return item.ownerPhone ? `${item.owner} (${item.ownerPhone})` : item.owner;
        })
        .filter(Boolean);
      if (owners.length > 0) return owners.join(', ');
    }
    if (car.owner) {
      return car.ownerPhone ? `${car.owner} (${car.ownerPhone})` : car.owner;
    }
    return '-';
  };

  const openAddModal = () => {
    setEditingCar(null);
    setName('');
    setRegNoInput('');
    setOwnerName('');
    setOwnerPhone('');
    setCarNumbers([]);
    setEditingUnitIndex(null);
    setCategory('Sedan');
    setSeats('');
    setTransmission('Automatic');
    setFuelType('Petrol');
    setPrice('');
    setImageUrl('');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (car: Car) => {
    setEditingCar(car);
    setName(car.name || '');

    const regs = extractRegistrations(car);
    setCarNumbers(regs);

    if (regs.length > 0) {
      setRegNoInput(regs[0].number || '');
      setOwnerName(regs[0].owner || '');
      setOwnerPhone(regs[0].ownerPhone || '');
      setEditingUnitIndex(0);
    } else {
      const singleNum = (car.registrationNumber || car.regNo || car.carNumber || '').trim();
      const singleOwner = (car.owner || '').trim();
      const singlePhone = (car.ownerPhone || '').trim();
      setRegNoInput(singleNum);
      setOwnerName(singleOwner);
      setOwnerPhone(singlePhone);
      setEditingUnitIndex(null);
    }

    setCategory(car.category || 'Sedan');
    setSeats(car.seats ?? '');
    setTransmission(car.transmission || 'Automatic');
    setFuelType(car.fuelType || 'Petrol');
    setPrice(car.pricePerDay ? car.pricePerDay.toString() : '');
    setImageUrl(car.imageUrl || '');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSaveUnitToList = () => {
    const num = regNoInput.trim().toUpperCase();
    const own = ownerName.trim();
    const ph = ownerPhone.trim();

    if (!num && !own) {
      toast.error('Please enter a Registration Number or Owner Name.');
      return;
    }

    if (editingUnitIndex !== null && editingUnitIndex >= 0 && editingUnitIndex < carNumbers.length) {
      // Update existing in array
      const updated = [...carNumbers];
      updated[editingUnitIndex] = { number: num, owner: own, ownerPhone: ph };
      setCarNumbers(updated);
      toast.success('Vehicle unit updated in list!');
    } else {
      // Check duplicate
      if (num && carNumbers.some((cn) => cn.number.toUpperCase() === num)) {
        toast.error('This Registration Number is already added for this car model.');
        return;
      }
      setCarNumbers([...carNumbers, { number: num, owner: own, ownerPhone: ph }]);
      toast.success('Vehicle unit added to list!');
    }

    // Reset unit inputs to allow adding more
    setRegNoInput('');
    setOwnerName('');
    setOwnerPhone('');
    setEditingUnitIndex(null);
  };

  const handleEditUnitFromList = (index: number) => {
    const unit = carNumbers[index];
    if (unit) {
      setRegNoInput(unit.number || '');
      setOwnerName(unit.owner || '');
      setOwnerPhone(unit.ownerPhone || '');
      setEditingUnitIndex(index);
    }
  };

  const handleRemoveUnit = (index: number) => {
    const updated = carNumbers.filter((_, i) => i !== index);
    setCarNumbers(updated);
    if (editingUnitIndex === index) {
      setRegNoInput('');
      setOwnerName('');
      setOwnerPhone('');
      setEditingUnitIndex(null);
    } else if (editingUnitIndex !== null && editingUnitIndex > index) {
      setEditingUnitIndex(editingUnitIndex - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar && !imageUrl && !imageFile) {
      toast.error('Please provide an image URL or upload an image.');
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

      // Automatically sync input state into carNumbers array if user typed into fields
      let finalCarNumbers = [...carNumbers];
      const currentReg = regNoInput.trim().toUpperCase();
      const currentOwner = ownerName.trim();
      const currentPhone = ownerPhone.trim();

      if (currentReg || currentOwner) {
        if (editingUnitIndex !== null && editingUnitIndex >= 0 && editingUnitIndex < finalCarNumbers.length) {
          finalCarNumbers[editingUnitIndex] = {
            number: currentReg,
            owner: currentOwner,
            ownerPhone: currentPhone,
          };
        } else {
          const existingIdx = finalCarNumbers.findIndex(
            (cn) => cn.number.toUpperCase() === currentReg && currentReg !== ''
          );
          if (existingIdx >= 0) {
            finalCarNumbers[existingIdx] = {
              number: currentReg,
              owner: currentOwner,
              ownerPhone: currentPhone,
            };
          } else {
            finalCarNumbers.push({
              number: currentReg,
              owner: currentOwner,
              ownerPhone: currentPhone,
            });
          }
        }
      }

      // Filter out completely blank entries
      finalCarNumbers = finalCarNumbers.filter(
        (cn) => (cn.number && cn.number.trim() !== '') || (cn.owner && cn.owner.trim() !== '')
      );

      // Determine primary registration and owner strings
      const primaryReg = finalCarNumbers[0]?.number || currentReg || '';
      const primaryOwner = finalCarNumbers[0]?.owner || currentOwner || '';
      const primaryPhone = finalCarNumbers[0]?.ownerPhone || currentPhone || '';

      const carPayload: any = {
        name: name.trim(),
        category,
        transmission,
        fuelType,
        pricePerDay: Number(price),
        imageUrl: finalImageUrl || (editingCar?.imageUrl ?? ''),
        // Store in all standard Firestore fields for full backward & forward compatibility
        carNumber: primaryReg,
        registrationNumber: primaryReg,
        regNo: primaryReg,
        owner: primaryOwner,
        ownerPhone: primaryPhone,
        carNumbers: finalCarNumbers,
      };

      if (seats !== '' && !isNaN(Number(seats))) {
        carPayload.seats = Number(seats);
      }

      if (editingCar) {
        await updateCar(editingCar.id, carPayload);
        toast.success('Car details updated successfully in database!');
      } else {
        await addCar({
          id: Date.now().toString(),
          ...carPayload,
        });
        toast.success('New car added successfully to database!');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error saving car to Firestore:', error);
      toast.error(error.message || 'Failed to save car. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Fleet Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your vehicles, license numbers, owners, and rental rates.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-sm shadow-primary/20"
        >
          <Plus size={18} /> Add New Car
        </button>
      </div>

      {/* MOBILE CARD VIEW (Optimized for phones & touch screens) */}
      <div className="block md:hidden space-y-4">
        {cars.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border border-gray-100">
            No cars found in fleet. Click "Add New Car" to add one.
          </div>
        ) : (
          cars.map((car) => {
            const displayReg = getDisplayRegNo(car);
            const displayOwner = getDisplayOwner(car);
            return (
              <div
                key={car.id}
                className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm space-y-3.5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={car.imageUrl}
                    alt={car.name}
                    className="w-20 h-16 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-bold text-secondary text-base leading-tight truncate">{car.name}</h3>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider flex-shrink-0">
                        {car.category}
                      </span>
                    </div>
                    <div className="text-primary font-bold text-base mt-1">
                      ₹{car.pricePerDay}
                      <span className="text-xs text-gray-400 font-normal"> / day</span>
                    </div>
                  </div>
                </div>

                {/* Key Vehicle Data Pills */}
                <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-gray-500 flex items-center gap-1.5">
                      <CarIcon size={14} className="text-gray-400" /> Reg No:
                    </span>
                    <span className="font-mono font-bold text-gray-800 bg-white px-2 py-0.5 rounded border border-gray-200 text-right truncate max-w-[200px]">
                      {displayReg}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-gray-500 flex items-center gap-1.5">
                      <User size={14} className="text-gray-400" /> Owner:
                    </span>
                    <span className="font-semibold text-secondary text-right truncate max-w-[200px]">
                      {displayOwner}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] text-gray-500">
                    <span>
                      {car.transmission} • {car.fuelType}
                    </span>
                    {car.seats && <span>{car.seats} Seats</span>}
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => openEditModal(car)}
                    className="flex-1 bg-blue-50 text-blue-600 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors"
                  >
                    <Edit size={14} /> Edit Car
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${car.name}?`)) {
                        deleteCar(car.id);
                        toast.success('Car removed.');
                      }
                    }}
                    className="bg-red-50 text-red-600 font-semibold p-2 rounded-xl text-xs hover:bg-red-100 transition-colors"
                    title="Delete car"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200">
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">IMAGE</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">NAME</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">REG NO.</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">OWNER</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">CATEGORY</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">TRANSMISSION</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">FUEL</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">PRICE/DAY</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => {
                const displayReg = getDisplayRegNo(car);
                const displayOwner = getDisplayOwner(car);
                return (
                  <tr key={car.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6">
                      <img
                        src={car.imageUrl}
                        alt={car.name}
                        className="w-16 h-12 object-cover rounded-md border border-gray-100"
                      />
                    </td>
                    <td className="py-3 px-6 font-bold text-secondary">{car.name}</td>
                    <td className="py-3 px-6 text-sm font-mono font-medium text-gray-700">
                      <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200/60 inline-block">
                        {displayReg}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm font-medium text-gray-600">{displayOwner}</td>
                    <td className="py-3 px-6">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                        {car.category}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600">{car.transmission}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">{car.fuelType}</td>
                    <td className="py-3 px-6 font-semibold text-secondary">₹{car.pricePerDay}</td>
                    <td className="py-3 px-6 text-right">
                      <button
                        onClick={() => openEditModal(car)}
                        className="text-blue-500 hover:text-blue-700 p-2"
                        title="Edit Car"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${car.name}?`)) {
                            deleteCar(car.id);
                            toast.success('Car removed.');
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-2"
                        title="Delete Car"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal (Fully responsive for mobile and desktop) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-secondary/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-8 my-auto max-h-[92vh] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-secondary">
                  {editingCar ? 'Edit Car Details' : 'Add New Car to Fleet'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Update model info, registration plates, and vehicle ownership details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 overflow-y-auto flex-1 pr-1">
              {/* Car Model Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Car Model Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  placeholder="e.g. Toyota Innova Crysta / Mahindra Thar"
                />
              </div>

              {/* Registration & Owner Section */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <label className="block text-sm font-bold text-secondary">
                      Vehicle Registration & Owner Details
                    </label>
                    <p className="text-xs text-gray-500">
                      {carNumbers.length > 0
                        ? `${carNumbers.length} vehicle unit(s) registered under this model.`
                        : 'Enter the vehicle number plate and owner information.'}
                    </p>
                  </div>
                  {editingUnitIndex !== null && (
                    <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full inline-flex items-center gap-1 self-start sm:self-auto">
                      Editing Unit #{editingUnitIndex + 1}
                    </span>
                  )}
                </div>

                {/* Input Fields for Unit */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Reg No. (Plate Number)
                    </label>
                    <input
                      type="text"
                      value={regNoInput}
                      onChange={(e) => setRegNoInput(e.target.value.toUpperCase())}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono text-sm bg-white uppercase placeholder:normal-case"
                      placeholder="e.g. TS08JU1684"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Owner Name</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                      placeholder="e.g. Ramesh Yadhav"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Owner WhatsApp / Phone
                    </label>
                    <input
                      type="tel"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                      placeholder="e.g. 8106698859"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSaveUnitToList}
                    className="bg-secondary text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-secondary/90 transition-colors flex items-center gap-1.5"
                  >
                    <Check size={14} />
                    {editingUnitIndex !== null ? 'Save Changes to Unit' : 'Add Unit to Model'}
                  </button>

                  {editingUnitIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setRegNoInput('');
                        setOwnerName('');
                        setOwnerPhone('');
                        setEditingUnitIndex(null);
                      }}
                      className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel Editing Unit
                    </button>
                  )}
                </div>

                {/* List of Registered Units */}
                {carNumbers.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60">
                    <div className="text-xs font-semibold text-gray-500 mb-1.5">Registered Units:</div>
                    <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {carNumbers.map((cn, idx) => (
                        <li
                          key={idx}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs border transition-colors ${
                            editingUnitIndex === idx
                              ? 'bg-amber-50 border-amber-300 text-amber-900'
                              : 'bg-white border-gray-200/80 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[11px] border border-slate-200">
                              {cn.number || 'NO REG NO'}
                            </span>
                            <span className="font-medium truncate">
                              {cn.owner ? `Owner: ${cn.owner}` : 'No Owner'}
                              {cn.ownerPhone ? ` (${cn.ownerPhone})` : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleEditUnitFromList(idx)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                              title="Edit this vehicle unit"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveUnit(idx)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                              title="Delete this unit"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Category, Transmission, Fuel, Seats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CarCategory)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="MUV">MUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as Transmission)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as FuelType)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Seats (Optional)</label>
                  <input
                    type="number"
                    value={seats}
                    onChange={(e) =>
                      setSeats(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
                    placeholder="e.g. 5"
                  />
                </div>
              </div>

              {/* Price per day */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Daily Rental Price (INR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm outline-none font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="e.g. 2500"
                  />
                </div>
              </div>

              {/* Car Image */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">Car Image</label>
                <div className="flex flex-col gap-2">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setImageFile(e.target.files?.[0] || null);
                        setImageUrl('');
                      }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                  <div className="relative flex items-center py-1">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-3 text-gray-400 text-[10px] font-bold">
                      OR PASTE IMAGE URL
                    </span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setImageFile(null);
                      }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                      placeholder={editingCar ? 'Leave empty to keep existing image' : 'https://...'}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex-shrink-0">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    'Saving & Uploading...'
                  ) : editingCar ? (
                    <>
                      <ShieldCheck size={18} /> Save Car Details
                    </>
                  ) : (
                    <>
                      <Plus size={18} /> Add Car to Fleet
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
