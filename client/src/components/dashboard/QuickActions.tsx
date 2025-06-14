
import { motion } from 'framer-motion';
import { UserPlus, FolderPlus, FileText, ChevronRight } from 'lucide-react';

const actions = [
  {
    title: 'Add New User',
    icon: UserPlus,
    description: 'Create a new user account'
  },
  {
    title: 'Create Category',
    icon: FolderPlus,
    description: 'Add a new issue category'
  },
  {
    title: 'Generate Report',
    icon: FileText,
    description: 'Create system reports'
  }
];

export const QuickActions = () => {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-white text-lg font-semibold mb-4">Quick Actions</h3>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <action.icon className="text-blue-400" size={20} />
              <span className="text-white font-medium">{action.title}</span>
            </div>
            <ChevronRight 
              className="text-slate-400 group-hover:text-white transition-colors" 
              size={16} 
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
