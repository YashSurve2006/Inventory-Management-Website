
import BuilderPage from "../../pcbuilder/pages/PCBuilder";



export default function PCBuilder() {

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">

            {/* Page Header */}
            <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-800">
                    Custom PC Builder
                </h1>

                <p className="text-gray-600 mt-2">
                    Build your own PC by selecting compatible components.
                    Our smart builder checks compatibility and calculates
                    the total price instantly.
                </p>

            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">

                <div className="bg-white shadow rounded-xl p-4 border">
                    <h3 className="font-semibold text-lg">
                        ⚙ Smart Compatibility
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                        Automatically checks CPU socket, RAM type,
                        and motherboard compatibility.
                    </p>
                </div>

                <div className="bg-white shadow rounded-xl p-4 border">
                    <h3 className="font-semibold text-lg">
                        💰 Live Price Calculation
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                        Instantly see total build price while
                        selecting components.
                    </p>
                </div>

                <div className="bg-white shadow rounded-xl p-4 border">
                    <h3 className="font-semibold text-lg">
                        🛒 Add Build To Cart
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                        Save your build or add the entire configuration
                        to your cart in one click.
                    </p>
                </div>

            </div>

            {/* Builder Module */}
            <div className="bg-white shadow-lg rounded-xl p-6 border">

                <BuilderPage />

            </div>

        </div>
    );
}