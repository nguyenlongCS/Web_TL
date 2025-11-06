// backend/seeds/seedData.js
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Product from '../models/Product.js'
import Service from '../models/Service.js'
import Project from '../models/Project.js'
import Review from '../models/Review.js'

dotenv.config({ path: './backend/.env' })

// Kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB Connected')
  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
    process.exit(1)
  }
}

// Hash password trước khi seed
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

// Data mẫu
const users = [
  {
    name: 'Admin',
    email: 'admin@thanhluan.com',
    password: '123456', // Plain password
    phone: '0999999999',
    role: 'admin'
  },
  {
    name: 'Nguyễn Văn A',
    email: 'user@test.com',
    password: '123456', // Plain password
    phone: '0911111111',
    role: 'user'
  }
]

const products = [
  {
    name: 'Loa JBL SRX815P',
    category: 'loa',
    price: 1200000,
    priceText: '1.200.000đ/ngày',
    rating: 4.8,
    stock: 12,
    imgSrc: '/frontend/assets/img/product1.jpg',
    description: 'Loa chuyên nghiệp công suất lớn'
  },
  {
    name: 'Amply Yamaha MG16XU',
    category: 'amply',
    price: 950000,
    priceText: '950.000đ/ngày',
    rating: 4.5,
    stock: 8,
    imgSrc: '/frontend/assets/img/product2.jpg',
    description: 'Bàn mixer chuyên nghiệp'
  },
  {
    name: 'Micro Shure SM58',
    category: 'phu-kien',
    price: 250000,
    priceText: '250.000đ/ngày',
    rating: 5.0,
    stock: 20,
    imgSrc: '/frontend/assets/img/product3.jpg',
    description: 'Micro có dây chất lượng cao'
  },
  {
    name: 'Loa Bose F1 Model 812',
    category: 'loa',
    price: 1500000,
    priceText: '1.500.000đ/ngày',
    rating: 4.6,
    stock: 5,
    imgSrc: '/frontend/assets/img/product4.jpg',
    description: 'Loa array linh hoạt'
  },
  {
    name: 'Mixer Behringer X32',
    category: 'khac',
    price: 1800000,
    priceText: '1.800.000đ/ngày',
    rating: 4.9,
    stock: 3,
    imgSrc: '/frontend/assets/img/product5.jpg',
    description: 'Bàn mixer digital cao cấp'
  },
  {
    name: 'Micro không dây Shure BLX24',
    category: 'phu-kien',
    price: 600000,
    priceText: '600.000đ/ngày',
    rating: 5.0,
    stock: 9,
    imgSrc: '/frontend/assets/img/product6.jpg',
    description: 'Micro không dây ổn định'
  },
  {
    name: 'Amply Crown XTi 4002',
    category: 'amply',
    price: 1100000,
    priceText: '1.100.000đ/ngày',
    rating: 4.7,
    stock: 7,
    imgSrc: '/frontend/assets/img/product7.jpg',
    description: 'Cục đẩy công suất mạnh mẽ'
  },
  {
    name: 'Loa Electro-Voice ELX200',
    category: 'loa',
    price: 1250000,
    priceText: '1.250.000đ/ngày',
    rating: 4.9,
    stock: 10,
    imgSrc: '/frontend/assets/img/product8.jpg',
    description: 'Loa đa năng chất lượng'
  },
  {
    name: 'Equalizer DBX 231s',
    category: 'khac',
    price: 500000,
    priceText: '500.000đ/ngày',
    rating: 4.4,
    stock: 6,
    imgSrc: '/frontend/assets/img/product9.jpg',
    description: 'Máy chỉnh âm 31 band'
  },
  {
    name: 'Tai nghe Sony MDR-7506',
    category: 'phu-kien',
    price: 300000,
    priceText: '300.000đ/ngày',
    rating: 5.0,
    stock: 15,
    imgSrc: '/frontend/assets/img/product10.jpg',
    description: 'Tai nghe monitor chuyên nghiệp'
  },
  {
    name: 'Subwoofer JBL PRX818XLF',
    category: 'loa',
    price: 1700000,
    priceText: '1.700.000đ/ngày',
    rating: 4.6,
    stock: 4,
    imgSrc: '/frontend/assets/img/product11.jpg',
    description: 'Loa sub bass mạnh mẽ'
  },
  {
    name: 'Processor DBX DriveRack PA2',
    category: 'khac',
    price: 850000,
    priceText: '850.000đ/ngày',
    rating: 4.9,
    stock: 11,
    imgSrc: '/frontend/assets/img/product12.jpg',
    description: 'Bộ xử lý tín hiệu âm thanh'
  }
]

const services = [
  {
    title: 'Cho thuê phụ kiện',
    imgSrc: '/frontend/assets/img/service1.jpg',
    description: 'Dịch vụ cho thuê thiết bị âm thanh chuyên nghiệp',
    order: 1
  },
  {
    title: 'Tổ chức sự kiện',
    imgSrc: '/frontend/assets/img/service2.jpg',
    description: 'Tổ chức sự kiện âm nhạc, hội nghị',
    order: 2
  },
  {
    title: 'Lắp đặt dự án',
    imgSrc: '/frontend/assets/img/service3.jpg',
    description: 'Lắp đặt hệ thống âm thanh cho các dự án',
    order: 3
  }
]

const projects = [
  {
    name: 'Khách sạn Grand Plaza',
    imgSrc: '/frontend/assets/img/project1.jpg',
    description: 'Hệ thống âm thanh khách sạn 5 sao',
    client: 'Grand Plaza Hotel',
    value: 2500000000,
    featured: true
  },
  {
    name: 'Trung tâm hội nghị SECC',
    imgSrc: '/frontend/assets/img/project2.jpg',
    description: 'Hệ thống âm thanh hội nghị hiện đại',
    client: 'SECC',
    value: 3000000000,
    featured: true
  },
  {
    name: 'Nhà hàng Skyline',
    imgSrc: '/frontend/assets/img/project3.jpg',
    description: 'Hệ thống âm thanh nhà hàng',
    client: 'Skyline Restaurant',
    value: 500000000,
    featured: true
  },
  {
    name: 'Rạp chiếu phim Galaxy',
    imgSrc: '/frontend/assets/img/project4.jpg',
    description: 'Hệ thống âm thanh Dolby Atmos',
    client: 'Galaxy Cinema',
    value: 5000000000,
    featured: false
  },
  {
    name: 'Hội trường RMIT University',
    imgSrc: '/frontend/assets/img/project5.jpg',
    description: 'Hệ thống âm thanh giảng đường',
    client: 'RMIT University',
    value: 1500000000,
    featured: false
  },
  {
    name: 'Trung tâm tiệc cưới Diamond',
    imgSrc: '/frontend/assets/img/project6.jpg',
    description: 'Hệ thống âm thanh sự kiện',
    client: 'Diamond Center',
    value: 800000000,
    featured: false
  },
  {
    name: 'Trung tâm thương mại Vincom',
    imgSrc: '/frontend/assets/img/project7.jpg',
    description: 'Hệ thống âm thanh trung tâm thương mại',
    client: 'Vincom',
    value: 2000000000,
    featured: false
  },
  {
    name: 'Club Premium',
    imgSrc: '/frontend/assets/img/project8.jpg',
    description: 'Hệ thống âm thanh club',
    client: 'Premium Club',
    value: 3500000000,
    featured: false
  },
  {
    name: 'Nhà thờ Tân Định',
    imgSrc: '/frontend/assets/img/project9.jpg',
    description: 'Hệ thống âm thanh nhà thờ',
    client: 'Tân Định Church',
    value: 600000000,
    featured: false
  },
  {
    name: 'Sân vận động Thống Nhất',
    imgSrc: '/frontend/assets/img/project10.jpg',
    description: 'Hệ thống âm thanh sân vận động',
    client: 'Thống Nhất Stadium',
    value: 4000000000,
    featured: false
  },
  {
    name: 'Chuỗi cà phê Highlands',
    imgSrc: '/frontend/assets/img/project11.jpg',
    description: 'Hệ thống âm thanh chuỗi cà phê',
    client: 'Highlands Coffee',
    value: 1000000000,
    featured: false
  },
  {
    name: 'Tòa nhà văn phòng Bitexco',
    imgSrc: '/frontend/assets/img/project12.jpg',
    description: 'Hệ thống âm thanh tòa nhà văn phòng',
    client: 'Bitexco',
    value: 3000000000,
    featured: false
  }
]

const reviews = [
  {
    author: 'Anh Tuấn',
    avatar: '/frontend/assets/img/avatar1.jpg',
    stars: 5,
    starsText: '★★★★★',
    text: 'Chất lượng âm thanh tuyệt vời, nhân viên hỗ trợ rất nhiệt tình!',
    approved: true
  },
  {
    author: 'Chị Hương',
    avatar: '/frontend/assets/img/avatar2.jpg',
    stars: 5,
    starsText: '★★★★★',
    text: 'Tôi thuê thiết bị cho sự kiện công ty, mọi thứ diễn ra suôn sẻ.',
    approved: true
  },
  {
    author: 'Nhật Minh',
    avatar: '/frontend/assets/img/avatar3.jpg',
    stars: 4,
    starsText: '★★★★',
    text: 'Giá cả hợp lý, dịch vụ chuyên nghiệp. Rất đáng để hợp tác lâu dài.',
    approved: true
  }
]

// Import data
const importData = async () => {
  try {
    // Xóa dữ liệu cũ
    await User.deleteMany()
    await Product.deleteMany()
    await Service.deleteMany()
    await Project.deleteMany()
    await Review.deleteMany()
    
    console.log('🗑️  Đã xóa dữ liệu cũ')

    // Hash passwords cho users
    console.log('🔐 Đang hash passwords...')
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await hashPassword(user.password)
      }))
    )

    // Thêm dữ liệu mới (insertMany sẽ KHÔNG trigger pre('save'))
    await User.insertMany(usersWithHashedPasswords)
    console.log('✅ Users imported')

    await Product.insertMany(products)
    console.log('✅ Products imported')

    await Service.insertMany(services)
    console.log('✅ Services imported')

    await Project.insertMany(projects)
    console.log('✅ Projects imported')

    await Review.insertMany(reviews)
    console.log('✅ Reviews imported')

    console.log('\n🎉 Import data thành công!')
    console.log('📊 Tổng kết:')
    console.log(`   - Users: ${users.length}`)
    console.log(`   - Products: ${products.length}`)
    console.log(`   - Services: ${services.length}`)
    console.log(`   - Projects: ${projects.length}`)
    console.log(`   - Reviews: ${reviews.length}`)
    console.log('\n👤 Thông tin đăng nhập:')
    console.log('   Admin:')
    console.log('   - Email: admin@thanhluan.com')
    console.log('   - Password: 123456')
    console.log('   User:')
    console.log('   - Email: user@test.com')
    console.log('   - Password: 123456')
    
    process.exit()
  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
    process.exit(1)
  }
}

// Xóa data
const destroyData = async () => {
  try {
    await User.deleteMany()
    await Product.deleteMany()
    await Service.deleteMany()
    await Project.deleteMany()
    await Review.deleteMany()

    console.log('🗑️  Đã xóa toàn bộ dữ liệu!')
    process.exit()
  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
    process.exit(1)
  }
}

// Chạy script
connectDB()

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}