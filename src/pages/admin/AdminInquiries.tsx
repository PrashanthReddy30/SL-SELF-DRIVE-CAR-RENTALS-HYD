import { useInquiryStore } from '../../store/inquiryStore';
import { Mail, Phone, Calendar, User, CheckCircle, Clock } from 'lucide-react';

export default function AdminInquiries() {
  const { inquiries, updateStatus } = useInquiryStore();

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-8">Customer Inquiries</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200">
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">CUSTOMER DETAILS</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">MESSAGE</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">DATE</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm text-right">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">No inquiries found.</td>
                </tr>
              ) : (
                inquiries.map(inquiry => (
                  <tr key={inquiry.id} className="border-b border-gray-100 hover:bg-gray-50 align-top">
                    <td className="py-6 px-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-secondary mb-1">{inquiry.name}</p>
                          <a href={`mailto:${inquiry.email}`} className="text-sm text-gray-500 flex items-center gap-1 hover:text-primary transition-colors mb-1"><Mail size={14} /> {inquiry.email}</a>
                          <a href={`tel:${inquiry.phone}`} className="text-sm text-gray-500 flex items-center gap-1 hover:text-primary transition-colors"><Phone size={14} /> {inquiry.phone}</a>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      {(inquiry.carName || inquiry.preferredDate) && (
                        <div className="mb-3 flex gap-2 flex-wrap">
                          {inquiry.carName && (
                            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
                              Enquiry for: {inquiry.carName}
                            </span>
                          )}
                          {inquiry.preferredDate && (
                            <span className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
                              Date: {new Date(inquiry.preferredDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-sm text-gray-700 max-w-md whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl border border-gray-100">{inquiry.message}</p>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-6 px-6 text-right">
                      <div className="flex flex-col items-end gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          inquiry.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                          inquiry.status === 'Read' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {inquiry.status === 'Resolved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                          {inquiry.status}
                        </span>
                        
                        {inquiry.status !== 'Resolved' && (
                          <div className="flex gap-2 mt-2">
                            {inquiry.status === 'Unread' && (
                              <button onClick={() => updateStatus(inquiry.id, 'Read')} className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">Mark Read</button>
                            )}
                            <button onClick={() => updateStatus(inquiry.id, 'Resolved')} className="text-xs font-semibold text-green-600 hover:text-green-800 transition-colors">Resolve</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
